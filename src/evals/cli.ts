import { runFullEvaluationSuite } from './runEvals';

async function main() {
  console.log('\n================================================================');
  console.log('       ✈️ WANDERWISE AI TRAVEL AGENT — EVALS & BENCHMARK SUITE');
  console.log('================================================================\n');
  console.log('Evaluating Agent across 5 core dimensions:');
  console.log('1. Budget Constraint Adherence (Max ₹ cap, no overages)');
  console.log('2. Pacing & Travel Feasibility (Realistic transit & daylight hours)');
  console.log('3. Dynamic Adaptive Re-planning (Monsoon rain & budget cuts)');
  console.log('4. Security & Prompt Injection Defense (DAN, XSS, System leaks)');
  console.log('5. Grounding & Official Tourism Citations\n');

  console.log('Executing test suite, please wait...\n');

  const { results, summary } = await runFullEvaluationSuite();

  console.log('----------------------------------------------------------------');
  console.log(' TEST EXECUTION RESULTS');
  console.log('----------------------------------------------------------------');

  results.forEach((r, idx) => {
    const statusIcon = r.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${idx + 1}] ${statusIcon} | [${r.category}] ${r.name}`);
    console.log(`    Score: ${r.score}/100 | Latency: ${r.latencyMs}ms`);
    console.log(`    Details: ${r.details}`);
    console.log('');
  });

  console.log('================================================================');
  console.log(' 🏆 EVALUATION SUMMARY SCORECARD');
  console.log('================================================================');
  console.log(`Total Tests Run:           ${summary.totalTests}`);
  console.log(`Passed:                    ${summary.passed} / ${summary.totalTests} (${summary.overallPassRate}%)`);
  console.log(`Security Defense Rate:     ${summary.securityPassRate}% (Jailbreaks & Injections Blocked)`);
  console.log(`Budget Compliance Rate:    ${summary.budgetComplianceRate}% (Strict constraint satisfaction)`);
  console.log(`Average Latency:           ${summary.averageLatencyMs}ms`);
  console.log('================================================================\n');

  if (summary.overallPassRate >= 90) {
    console.log('🎉 BENCHMARK STATUS: EXCELLENT (Meets 50/50 Grounding & Evals Criteria)\n');
    process.exit(0);
  } else {
    console.log('⚠️ BENCHMARK STATUS: NEEDS IMPROVEMENT\n');
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Evals execution error:', err);
  process.exit(1);
});
