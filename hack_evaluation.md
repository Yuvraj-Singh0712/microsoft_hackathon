# AI Agent Hackathon Evaluation Report

## 1. Overall Score

| Parameter | Maximum Marks | Awarded Marks | Percentage |
|---|---|---|---|
| Problem Statement Alignment | 100 | 86 | 86% |
| Code Quality | 100 | 82 | 82% |
| Innovation | 100 | 80 | 80% |
| Security | 100 | 84 | 84% |
| Grounding and Evals | 50 | 38 | 76% |
| **Total Score** | **450** | **370** | **82.22%** |

---

## 2. Executive Summary
- **Overall Assessment:** WanderWise AI is a credible, polished travel-planning agent with a concrete architecture for parsing trip requests, grounding travel suggestions in a curated destination dataset, enforcing budget and pace constraints, and supporting dynamic re-planning. It clearly solves the hackathon prompt by generating a 5-day Delhi-to-hills trip under a budget cap with a relaxed, nature/food orientation and an interactive front-end experience. The solution is strong as a functional prototype but still sits below production-grade quality because it relies on a curated in-repo dataset and static heuristics rather than a fully robust retrieval or live-data pipeline.
- **Main Strengths:** The agent has clear intent parsing, budget validation, destination knowledge base, adaptive re-planning, and a built-in security audit sandbox. The UI surfaces reasoning steps and live itinerary changes in a way that is easy to inspect and judge. The project also includes an explicit benchmark suite and a security test matrix.
- **Significant Weaknesses:** The system is narrower than a broader general-purpose travel agent, with destination logic and theme detection coded as heuristics rather than a more robust general planner. Some rule-based logic and static assumptions reduce portability for arbitrary destinations and edge cases. Security is strengthened with regex-based detection, but the project does not implement deeper prompt-isolation, server-side validation, or policy enforcement for real deployment.
- **Key Technical Observations:** The architecture separates parsing, security guardrails, tool dispatch, budget validation, and replanning in a readable modular structure. The project also demonstrates a practical “hybrid” pattern: a local grounded engine with optional Gemini integration when an API key is present. That said, the system still leans heavily on local heuristics and manually curated catalog data instead of externally verifiable retrieval or live APIs.
- **Important Security Concerns:** The security layer is substantially better than a naive wrapper, and it blocks obvious jailbreak and injection payloads. However, the protections are still mostly regex-based and local to the browser environment; they are not a full defensive boundary against adversarial indirect prompting or future tool-execution abuse.
- **Alignment with Problem Statement:** The project aligns well with the travel-agent brief: it understands user preferences, validates constraints, builds a personalized plan, and supports adaptive re-planning. It does not fully generalize to every travel scenario or real-world live-data integration, but it reflects the core intent of the prompt within a strong hackathon implementation.

---

## 3. Detailed Parameter Evaluations

### 3.1 Problem Statement Alignment (Awarded: 86 / 100)
- **Assessment:** This submission strongly matches the stated travel-agent problem: it parses a natural-language plan request, identifies origin, travelers, budget, duration, pace, and themes, and then synthesizes a travel itinerary under budget. It also supports re-planning when the user changes constraints or a disruption occurs, which is one of the required capabilities. The default prompt in the app even matches the official challenge: “Plan a 5-day trip from Delhi for 2 people under ₹50K, focused on nature and food, with a relaxed itinerary.” The implementation is practical and clearly centered on a grounded travel plan rather than generic chat.
- **Evidence:**
  - Files Inspected: [src/App.tsx](src/App.tsx#L24-L118), [src/agent/planner.ts](src/agent/planner.ts#L18-L188), [src/agent/replanner.ts](src/agent/replanner.ts#L18-L168), [src/evals/testCases.ts](src/evals/testCases.ts#L1-L86)
  - Implementation Findings: The planner applies parsing rules for budget, duration, traveler count, origin detection, destinations, themes, pace, and dietary restrictions; the replanner swaps activities for rain or budget disruptions; the app generates and displays the itinerary in the main studio.
- **Strengths:**
  - The app initializes with the exact challenge prompt and generates a fitting itinerary in the UI, showing good alignment with the hackathon brief: [src/App.tsx](src/App.tsx#L31-L45)
  - Intent extraction covers the main travel constraints in a realistic way: [src/agent/planner.ts](src/agent/planner.ts#L36-L96)
  - Adaptive replanning is implemented for forecast and budget disruptions: [src/agent/replanner.ts](src/agent/replanner.ts#L20-L112)
- **Weaknesses & Gaps:**
  - The system is tuned to a narrow destination and a limited set of heuristics, so it is not a broad, general travel planner for arbitrary cities or cross-country multi-stop itineraries: [src/agent/planner.ts](src/agent/planner.ts#L80-L96)
  - Theme, destination, and pace detection are rule-based and may miss complex natural-language requests or conflicting constraints without additional validation logic.
- **Recommendations:**
  - Expand the parsing grammar to support more travel requests with explicit constraints such as dates, hotel class, transport mode, and weather windows.
  - Add a stricter validation layer to ensure generated itineraries satisfy all parsed constraints before display.

### 3.2 Code Quality (Awarded: 82 / 100)
- **Assessment:** The codebase is modular, readable, and type-driven, with clear separation between intent parsing, security checks, tool execution, and UI. The TypeScript model definitions in [src/types/travel.ts](src/types/travel.ts) provide consistent contracts across planner, itinerary, and evaluation modules. The project structure is easier to maintain than a monolithic prompt wrapper, and the naming is generally clear.
- **Evidence:**
  - Files Inspected: [src/types/travel.ts](src/types/travel.ts#L1-L140), [src/agent/planner.ts](src/agent/planner.ts#L1-L188), [src/agent/guardrails.ts](src/agent/guardrails.ts#L1-L165), [src/agent/tools/budgetValidator.ts](src/agent/tools/budgetValidator.ts#L1-L77)
  - Implementation Findings: The planner, guardrails, and tools are intentionally separated; typed objects define itinerary, budget, activity, and security structures; there is a clear set of tool classes for transit, attraction, accommodation, and budget checks.
- **Strengths:**
  - Components are split by responsibility and not bundled into one giant script: [src/agent/planner.ts](src/agent/planner.ts), [src/agent/guardrails.ts](src/agent/guardrails.ts), [src/agent/tools/transitTool.ts](src/agent/tools/transitTool.ts), [src/agent/tools/attractionTool.ts](src/agent/tools/attractionTool.ts)
  - The datamodel is robust enough to support the planner and UI: [src/types/travel.ts](src/types/travel.ts#L1-L140)
  - The project includes a benchmark suite and a testing UI: [src/evals/runEvals.ts](src/evals/runEvals.ts#L1-L119), [src/components/EvalsDashboard.tsx](src/components/EvalsDashboard.tsx#L1-L236)
- **Weaknesses & Gaps:**
  - Many values are hardcoded to the Rishikesh/Landour use case and are not generalized across wider trip scenarios: [src/agent/groundData.ts](src/agent/groundData.ts#L1-L220)
  - There is no backend or server-side validation layer; front-end-only behavior reduces resilience in a production deployment.
  - The project references an optional Gemini API and uses a memory-only key mechanism rather than an environment-variable-first pattern with secure secret handling: [src/agent/geminiClient.ts](src/agent/geminiClient.ts#L1-L39), [src/components/ApiKeyModal.tsx](src/components/ApiKeyModal.tsx#L1-L104)
- **Recommendations:**
  - Move sensitive configuration to a server-side or environment-backed setup, and constrain API key use to secure channels.
  - Add more coverage for malformed inputs and conflicting constraints beyond the current curated scenarios.

### 3.3 Innovation (Awarded: 80 / 100)
- **Assessment:** This is more than a direct API wrapper. It introduces a grounded, modular agent workflow: parsing, threat detection, tool dispatch, budget validation, itinerary synthesis, and adaptive re-planning. The “What-If” simulator is a practical innovation because it lets the user alter a plan under disruption and see the system adapt. The architecture shows deliberate design choices rather than just a raw LLM call.
- **Evidence:**
  - Files Inspected: [src/agent/replanner.ts](src/agent/replanner.ts#L18-L168), [src/components/WhatIfSimulator.tsx](src/components/WhatIfSimulator.tsx#L1-L230), [src/components/SecuritySandbox.tsx](src/components/SecuritySandbox.tsx#L1-L220), [src/agent/groundData.ts](src/agent/groundData.ts#L1-L220)
  - Implementation Findings: The planner uses domain-specific tools and a local knowledge base; the replanner dynamically updates the itinerary under disruptions; the security sandbox shows red-team testing patterns.
- **Strengths:**
  - The adaptive re-planning flow is a solid agentic pattern: [src/agent/replanner.ts](src/agent/replanner.ts#L20-L112)
  - The system combines knowledge grounding, tool constraints, and interactive UI in one coherent product: [src/App.tsx](src/App.tsx#L24-L118)
  - The security and evaluation dashboards show an agent that is designed to be inspected and tested rather than just chat-based: [src/components/SecuritySandbox.tsx](src/components/SecuritySandbox.tsx), [src/components/EvalsDashboard.tsx](src/components/EvalsDashboard.tsx)
- **Weaknesses & Gaps:**
  - The architecture is still rule-heavy and custom-coded; it does not add a highly novel multi-agent or graph-based control flow beyond structured planner/replanner design.
  - There is no persistent memory, retrieval indexing, or dynamic knowledge base integration beyond a curated static object.
- **Recommendations:**
  - Add a retrieval layer that queries real travel data sources and ranks options by price, weather, and user preference.
  - Introduce a more explicit planner-critic loop or reflection step to improve itinerary quality.

### 3.4 Security (Awarded: 84 / 100)
- **Assessment:** The project takes prompt-injection and budget-tampering threats seriously, and the guardrail file contains a meaningful multi-pattern detection suite. It sanitizes HTML-like payloads, strips control characters, blocks “ignore previous instructions” and developer-mode attempts, and rejects illicit or contraband directives. That is a solid foundation for adversarial robustness in a hackathon environment. The absence of sensitive credentials in the repo is also a positive sign.
- **Evidence:**
  - Files Inspected: [src/agent/guardrails.ts](src/agent/guardrails.ts#L1-L165), [src/evals/testCases.ts](src/evals/testCases.ts#L1-L86), [src/components/SecuritySandbox.tsx](src/components/SecuritySandbox.tsx#L1-L220), [src/agent/geminiClient.ts](src/agent/geminiClient.ts#L1-L39)
  - Findings: Injection patterns include direct override attempts, DAN personas, budget tampering, XSS, and illicit-activity prompts; the sanitization logic strips tags and control characters before passing data to the planner.
- **Strengths:**
  - Clear security checks against prompt injection and jailbreak attacks: [src/agent/guardrails.ts](src/agent/guardrails.ts#L4-L96)
  - Red-team benchmark vectors are present and user-visible: [src/evals/testCases.ts](src/evals/testCases.ts#L7-L55)
  - The planner rejects unsafe requests when threat levels are high or critical: [src/agent/planner.ts](src/agent/planner.ts#L127-L151)
- **Weaknesses & Gaps:**
  - The protections appear mostly regex-based and local to the app, which means semantic or indirect prompt injection may not be fully covered.
  - Input sanitization is not a complete security boundary; it is more of a front-line filter than a hardened policy engine.
  - Client-side key handling in the browser is not production-grade for secret management: [src/components/ApiKeyModal.tsx](src/components/ApiKeyModal.tsx#L13-L90)
- **Recommendations:**
  - Add a stronger model boundary and content-policy enforcement layer, with structured trusted/untrusted data separation.
  - Use server-side or environment-managed secret policy for any third-party LLM access and restrict browser exposure.

### 3.5 Grounding and Evals (Awarded: 38 / 50.0)
- **Subcategory Breakdown:**
  - **Grounding Score:** 20.0 / 25.0
  - **Evals Score:** 18.0 / 25.0
  - **Total Grounding and Evals:** 38.0 / 50.0
- **Assessment:**
  - Grounding: The project includes a highly curated ground-truth travel knowledge base with destination metadata, admission costs, weather suitability, transit instructions, and source citations. This gives the output a traceable travel knowledge layer and shows strong grounding in a domain-specific source set. The system does not, however, implement a more advanced retrieval pipeline or external verification flow, and the grounding remains mostly static and manually curated rather than dynamically retrieved.
  - Evals: The repo contains explicit evaluation scenarios, a benchmark runner, and security attack vectors. This is a meaningful and reproducible suite, but it is still lightweight compared with a more complete benchmark framework and it is not fully automated in CI from the environment used here.
- **Evidence:**
  - Files Inspected: [src/agent/groundData.ts](src/agent/groundData.ts#L1-L220), [src/evals/runEvals.ts](src/evals/runEvals.ts#L1-L119), [src/components/EvalsDashboard.tsx](src/components/EvalsDashboard.tsx#L1-L236), [src/agent/tools/transitTool.ts](src/agent/tools/transitTool.ts#L1-L44)
  - Implementation Findings: Every activity in the destination database includes source attribution strings, and benchmark suites are implemented for budget compliance, security defense, and re-planning. The evaluation system is explicit and reproducible in code.
- **Strengths:**
  - The curated knowledge base includes source citations and realistic destination data: [src/agent/groundData.ts](src/agent/groundData.ts#L1-L220)
  - The suite tests prompt-injection blocking, budget adherence, and dynamic replanning: [src/evals/runEvals.ts](src/evals/runEvals.ts#L19-L113)
- **Weaknesses & Gaps:**
  - Grounding is not live or retrieval-based; it relies on static entries rather than authoritative, up-to-date internet data or a search pipeline.
  - The project does not demonstrate LLM-as-a-judge or semantic evaluations beyond direct rule-based checks.
- **Recommendations:**
  - Add retrieval-backed grounding with chunked source documents, relevance ranking, and answer citations.
  - Expand evals to cover fallback behavior, contradictory user requests, and multi-turn interactions.

---

## 4. Cross-Cutting Findings
- **Architecture & Modularity:** The project cleanly separates safe input validation, plan generation, tool execution, and UI rendering. This is a strong practical architecture for a hackathon prototype.
- **Reliability & Resilience:** The planner and replanner support fallback behavior with weather-aware changes and budget balancing. It is not a full distributed failure-tolerant system, but it handles the requested disruption and constraint scenarios well.
- **Security Posture:** Security is clearly considered and the app demonstrates multiple defensive layers. The main limitation is that the implementation is still largely deterministic pattern-matching instead of richer policy enforcement.
- **Evaluation Maturity:** Benchmark coverage exists and is implemented in code, which is a real strength. The harness is not broad enough to be a full production evaluation platform, but it is relevant and meaningful for the travel-agent brief.
- **Maintainability & Extensibility:** The project is fairly maintainable because it uses types, modular components, and a consistent data schema. Its custom knowledge base and heuristic logic do, however, make future extension slower unless more formalized.
- **Reproducibility:** The repo has a clear evaluation entrypoint and a frontend app structure, but actual local execution in this environment was blocked by PowerShell security restrictions, which limited runtime verification.

---

## 5. Critical Issues & Vulnerabilities

| Issue | Severity (Critical/High/Medium/Low) | Affected Component | Confirmation Status (Confirmed/Potential) | Evidence | Potential Impact |
|---|---|---|---|---|---|
| Regex-only prompt filtering may miss complex indirect prompt-injection patterns or obfuscated bypasses | Medium | [src/agent/guardrails.ts](src/agent/guardrails.ts#L4-L96) | Potential | The guardrail uses pattern matching on known phrases rather than model-enforced instruction boundaries or structured trusted/untrusted separation. | A future adversarial payload could reach the planner if it uses a different phrasing or semantic variant. |
| Browser-held API keys are not a hardened production secret-management pattern | Medium | [src/agent/geminiClient.ts](src/agent/geminiClient.ts#L1-L39), [src/components/ApiKeyModal.tsx](src/components/ApiKeyModal.tsx#L13-L90) | Potential | The key is held in a JS variable and supplied through a browser modal rather than server-side environment management. | Client-side exposure risk and poor operational security in a production deployment. |
| Static knowledge base narrows trust and freshness of destination recommendations | Low | [src/agent/groundData.ts](src/agent/groundData.ts#L1-L220) | Confirmed | Destination and dining data are manually curated and not dynamically retrieved from authoritative live sources. | It may be stale or incomplete for real-world travel guidance. |

---

## 6. Final Summary & Judging Verdict
- **Final Score Breakdown:**
  - Problem Statement Alignment: 86 / 100
  - Code Quality: 82 / 100
  - Innovation: 80 / 100
  - Security: 84 / 100
  - Grounding and Evals: 38 / 50.0
  - **Total Score: 370 / 450.0**
- **Strongest Aspects:** Strong alignment to the travel-plan brief, clear modular structure, meaningful red-team and benchmarking efforts, and an effective adaptive replanning workflow.
- **Major Gaps:** More robust generalization beyond a curated destination set, stronger product-grade security boundaries, and a more advanced live-grounding layer.
- **Improvement Priorities:**
  1. Add a robust retrieval layer and factual source management for real-world grounded recommendations.
  2. Harden safety policy and prompt isolation beyond regex filtering.
  3. Expand evaluation breadth to multi-turn, contradictory-input, and error-recovery scenarios.
- **Evaluation Limitations:** The repo contains a valid implementation and evaluation harness, but actual runtime verification in this environment was blocked by a PowerShell security policy error: “UnauthorizedAccess” when invoking the existing build and CLI commands. The scoring above is therefore based on direct code inspection, repository structure, and the project’s authored evaluation logic rather than successful execution in this session.
