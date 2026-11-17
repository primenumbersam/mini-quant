// Node.js zero-dependency SEC EDGAR facts fetcher & compressor
const fs = require('fs');
const path = require('path');

const COMPANIES = [
  { ticker: 'MSFT', name: 'Microsoft Corporation', cik: '0000789019', serverRatio: 0.65, usefulLifeRep: 6 },
  { ticker: 'AMZN', name: 'Amazon.com Inc', cik: '0001018724', serverRatio: 0.60, usefulLifeRep: 5 },
  { ticker: 'GOOG', name: 'Alphabet Inc', cik: '0001652044', serverRatio: 0.70, usefulLifeRep: 6 },
  { ticker: 'META', name: 'Meta Platforms Inc', cik: '0001326801', serverRatio: 0.70, usefulLifeRep: 5 },
  { ticker: 'AAPL', name: 'Apple Inc', cik: '0000320193', serverRatio: 0.40, usefulLifeRep: 4 },
  { ticker: 'NVDA', name: 'NVIDIA Corporation', cik: '0001045810', serverRatio: 0.50, usefulLifeRep: 4 },
  { ticker: 'TSLA', name: 'Tesla Inc', cik: '0001318605', serverRatio: 0.45, usefulLifeRep: 5 }
];

const HEADERS = {
  'User-Agent': 'DigitalResearchLab/1.0 (invest@digitallab.local)',
  'Accept-Encoding': 'gzip, deflate',
  'Host': 'data.sec.gov'
};

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Helper: Extract value for a specific FY and target tags, preferring latest filing
function findTagValueForFy(facts, tagList, fy) {
  const usGaap = facts?.facts?.['us-gaap'];
  if (!usGaap) return { val: 0, tag: null };

  for (const tag of tagList) {
    const item = usGaap[tag];
    if (item && item.units) {
      const unitKey = Object.keys(item.units)[0];
      const records = item.units[unitKey] || [];
      // Look for 10-K records matching fy and annual scope (duration ~12m or fp: 'FY')
      const matches = records.filter(r => 
        (r.form === '10-K' || r.form === '10-K/A') &&
        r.fy === fy &&
        (r.fp === 'FY' || !r.fp)
      );

      if (matches.length > 0) {
        // Pick record with latest filed date or largest frame
        const sorted = matches.sort((a, b) => (b.filed || '').localeCompare(a.filed || ''));
        // If there's an annual duration record (start & end spanning ~1 year), prefer it over instant
        const durationRecord = sorted.find(r => r.start && r.end && r.start !== r.end);
        const chosen = durationRecord || sorted[0];
        if (chosen && chosen.val !== undefined && chosen.val !== null) {
          return { val: chosen.val, tag: tag };
        }
      }
    }
  }
  return { val: 0, tag: null };
}

function findBalanceSheetTagValueForFy(facts, tagList, fy) {
  const usGaap = facts?.facts?.['us-gaap'];
  if (!usGaap) return { val: 0, tag: null };

  for (const tag of tagList) {
    const item = usGaap[tag];
    if (item && item.units) {
      const unitKey = Object.keys(item.units)[0];
      const records = item.units[unitKey] || [];
      // Balance sheet items are instantaneous at fiscal year-end
      const matches = records.filter(r => 
        (r.form === '10-K' || r.form === '10-K/A') &&
        (r.fy === fy || (r.end && r.end.startsWith(String(fy))))
      );

      if (matches.length > 0) {
        const sorted = matches.sort((a, b) => (b.filed || '').localeCompare(a.filed || ''));
        if (sorted[0] && sorted[0].val !== undefined) {
          return { val: sorted[0].val, tag: tag };
        }
      }
    }
  }
  return { val: 0, tag: null };
}

async function fetchCompanyFacts(company) {
  const url = `https://data.sec.gov/api/xbrl/companyfacts/CIK${company.cik}.json`;
  console.log(`[Fetching] ${company.ticker} (${company.cik})...`);
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    throw new Error(`Failed to fetch ${company.ticker}: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

function processFacts(company, rawFacts) {
  const usGaap = rawFacts?.facts?.['us-gaap'] || {};

  // Find all available 10-K FYs from CFO and Revenue
  const cfoTag = usGaap['NetCashProvidedByUsedInOperatingActivities'];
  const revTags = ['RevenueFromContractWithCustomerExcludingAssessedTax', 'SalesRevenueNet', 'Revenues'];
  
  const candidateFys = new Set();
  if (cfoTag?.units?.USD) {
    cfoTag.units.USD.filter(r => (r.form === '10-K' || r.form === '10-K/A') && r.fy).forEach(r => candidateFys.add(r.fy));
  }
  for (const t of revTags) {
    if (usGaap[t]?.units?.USD) {
      usGaap[t].units.USD.filter(r => (r.form === '10-K' || r.form === '10-K/A') && r.fy).forEach(r => candidateFys.add(r.fy));
    }
  }

  const sortedFys = Array.from(candidateFys).sort((a, b) => b - a);
  const targetFys = sortedFys.slice(0, 3); // recent 3 fiscal years

  const years = {};
  for (const fy of targetFys) {
    const rev = findTagValueForFy(rawFacts, [
      'RevenueFromContractWithCustomerExcludingAssessedTax',
      'SalesRevenueNet',
      'Revenues'
    ], fy);

    const cfo = findTagValueForFy(rawFacts, [
      'NetCashProvidedByUsedInOperatingActivities'
    ], fy);

    const capex = findTagValueForFy(rawFacts, [
      'PaymentsToAcquirePropertyPlantAndEquipment',
      'PaymentsToAcquireProductiveAssets',
      'PaymentsForPropertyPlantAndEquipment',
      'CapitalExpendituresIncurredButNotYetPaid'
    ], fy);

    const sbc = findTagValueForFy(rawFacts, [
      'AllocatedShareBasedCompensationExpense',
      'ShareBasedCompensation'
    ], fy);

    const lease = findTagValueForFy(rawFacts, [
      'FinanceLeasePrincipalPayments',
      'RepaymentsOfLongTermCapitalLeaseObligations',
      'FinanceLeaseLiabilityPayments'
    ], fy);

    const rdCap = findTagValueForFy(rawFacts, [
      'CapitalizedComputerSoftwareAdditions',
      'PaymentsToDevelopSoftware',
      'ResearchAndDevelopmentExpenseSoftwareExcludingAcquiredInProcessCost'
    ], fy);

    const ppe = findBalanceSheetTagValueForFy(rawFacts, [
      'PropertyPlantAndEquipmentAndFinanceLeaseRightOfUseAssetAfterAccumulatedDepreciationAndAmortization',
      'PropertyPlantAndEquipmentNet',
      'PropertyPlantAndEquipmentGross'
    ], fy);

    years[fy] = {
      fy,
      revenue: rev.val,
      revenueTag: rev.tag,
      cfo: cfo.val,
      cfoTag: cfo.tag,
      capex: capex.val,
      capexTag: capex.tag,
      sbc: sbc.val,
      sbcTag: sbc.tag,
      leasePayments: lease.val,
      leaseTag: lease.tag,
      capitalizedSoftware: rdCap.val,
      capitalizedSoftwareTag: rdCap.tag,
      ppeNet: ppe.val,
      ppeTag: ppe.tag,
      circularRate: 0.03,
      partnerRevRate: 0.12,
      takeRate: 0.20
    };
  }

  return {
    ticker: company.ticker,
    name: company.name,
    cik: company.cik,
    serverRatio: company.serverRatio,
    usefulLifeRep: company.usefulLifeRep,
    years
  };
}

async function main() {
  const result = {};
  for (const comp of COMPANIES) {
    try {
      const raw = await fetchCompanyFacts(comp);
      const clean = processFacts(comp, raw);
      result[comp.ticker] = clean;
      console.log(`[Success] ${comp.ticker} processed.`);
      for (const [fy, d] of Object.entries(clean.years)) {
        console.log(`  FY${fy}: Rev=${(d.revenue/1e9).toFixed(1)}B, CFO=${(d.cfo/1e9).toFixed(1)}B, CapEx=${(d.capex/1e9).toFixed(1)}B (${d.capexTag}), SBC=${(d.sbc/1e9).toFixed(1)}B, PPE=${(d.ppeNet/1e9).toFixed(1)}B`);
      }
      await delay(500);
    } catch (err) {
      console.error(`[Error] ${comp.ticker}:`, err.message);
    }
  }

  const outPath = path.join(__dirname, 'data.json');
  const payload = {
    updatedAt: new Date().toISOString().split('T')[0],
    source: 'SEC EDGAR 10-K Company Facts API',
    companies: result
  };
  fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`\n[Complete] Successfully generated ${outPath} (updatedAt: ${payload.updatedAt})`);
}

main();
