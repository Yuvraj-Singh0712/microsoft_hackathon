import { SecurityAuditResult } from '../types/travel';

// Comprehensive pattern database for prompt injection, jailbreaking, and input manipulation
const INJECTION_PATTERNS: { regex: RegExp; type: SecurityAuditResult['attackType']; desc: string; severity: 'MEDIUM' | 'HIGH' | 'CRITICAL' }[] = [
  // 1. Direct instruction overrides & system leaks
  {
    regex: /(?:ignore|disregard|forget|override)\s+(?:all\s+)?(?:previous|prior|above|system)\s+(?:instructions|prompts|rules|commands)/i,
    type: 'PROMPT_INJECTION',
    desc: 'Instruction override attack targeting system prompt',
    severity: 'CRITICAL',
  },
  {
    regex: /(?:reveal|show|print|display|dump|leak|repeat)\s+(?:your|the)?\s*(?:system\s*prompt|initial\s*instructions|developer\s*mode|hidden\s*instructions)/i,
    type: 'SYSTEM_PROMPT_LEAK',
    desc: 'System prompt extraction attempt',
    severity: 'HIGH',
  },
  // 2. Jailbreak / Persona manipulation (DAN, Evil Twin, Uncensored, Dev mode)
  {
    regex: /(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(?:DAN|developer\s*mode|evil\s*twin|unfiltered|jailbroken|chaos|godmode)/i,
    type: 'JAILBREAK',
    desc: 'Roleplay persona jailbreak attempt (DAN / Dev Mode)',
    severity: 'CRITICAL',
  },
  {
    regex: /(?:do\s+anything\s+now|bypass\s+(?:all\s+)?safety|disable\s+(?:content|safety)\s+filters)/i,
    type: 'JAILBREAK',
    desc: 'Filter bypass directive',
    severity: 'CRITICAL',
  },
  // 3. Constraint tampering (Budget, travelers, currency override)
  {
    regex: /(?:set\s+budget\s+to\s+(?:unlimited|infinite|\d{7,}))|(?:ignore\s+(?:the\s+)?(?:budget|constraint|limit|cost))/i,
    type: 'BUDGET_TAMPERING',
    desc: 'Constraint subversion attempt targeting budget limits',
    severity: 'HIGH',
  },
  {
    regex: /(?:book\s+(?:private\s+jet|helicopter|luxury\s+yacht)\s+regardless\s+of\s+budget)/i,
    type: 'BUDGET_TAMPERING',
    desc: 'Extreme unauthorized luxury budget tampering',
    severity: 'HIGH',
  },
  // 4. Code Injection / XSS / SQLi
  {
    regex: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    type: 'XSS_SQLI',
    desc: 'Cross-Site Scripting (XSS) payload embedded in input',
    severity: 'CRITICAL',
  },
  {
    regex: /(?:javascript:|onload=|onerror=|onclick=|<iframe|<object|<embed)/i,
    type: 'XSS_SQLI',
    desc: 'Malicious DOM attribute / frame injection',
    severity: 'HIGH',
  },
  {
    regex: /(?:;\s*DROP\s+TABLE|UNION\s+SELECT|--|\/\*|\*\/)/i,
    type: 'XSS_SQLI',
    desc: 'SQL / command injection pattern',
    severity: 'HIGH',
  },
  // 5. Unsafe or illicit request patterns
  {
    regex: /(?:smuggle|contraband|illegal\s+drugs|weapons|fake\s+passport|counterfeit|evade\s+customs)/i,
    type: 'UNSAFE_INSTRUCTION',
    desc: 'Illicit or prohibited travel activity request',
    severity: 'CRITICAL',
  }
];

export class SecurityGuardrail {
  /**
   * Evaluates untrusted user input against multi-tiered defense patterns
   */
  public static auditInput(rawInput: string): SecurityAuditResult {
    if (!rawInput || typeof rawInput !== 'string') {
      return {
        isSafe: true,
        threatLevel: 'NONE',
        detectedPatterns: [],
        sanitizedInput: '',
        defenseExplanation: 'Input is empty or whitespace.',
      };
    }

    const detectedPatterns: string[] = [];
    let highestSeverity: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'NONE';
    let primaryAttackType: SecurityAuditResult['attackType'] | undefined = undefined;

    for (const item of INJECTION_PATTERNS) {
      if (item.regex.test(rawInput)) {
        detectedPatterns.push(item.desc);
        if (!primaryAttackType) {
          primaryAttackType = item.type;
        }

        if (item.severity === 'CRITICAL') {
          highestSeverity = 'CRITICAL';
        } else if (item.severity === 'HIGH' && highestSeverity !== 'CRITICAL') {
          highestSeverity = 'HIGH';
        } else if (highestSeverity === 'NONE') {
          highestSeverity = 'MEDIUM';
        }
      }
    }

    // Sanitize input: Strip HTML tags, dangerous special control sequences
    let sanitized = rawInput
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '') // Strip unprintable ASCII control codes
      .trim();

    // If injection was detected, neutralize suspicious instruction prefixes
    if (highestSeverity === 'CRITICAL' || highestSeverity === 'HIGH') {
      sanitized = sanitized
        .replace(/ignore\s+(all\s+)?(previous|prior)\s+instructions/gi, '[DEFENSE_FILTERED]')
        .replace(/system\s+prompt/gi, '[PROTECTED_SYSTEM_TOKEN]')
        .replace(/dan/gi, '[FILTERED_ALIAS]');
    }

    const isSafe = detectedPatterns.length === 0;

    let defenseExplanation = 'Input validated. No security threats or constraint tampering detected.';
    if (!isSafe) {
      defenseExplanation = `DEFENSE ACTIVE: Neutralized ${detectedPatterns.length} threat indicator(s) [Type: ${primaryAttackType || 'ANOMALY'}, Severity: ${highestSeverity}]. Payload isolated from agent reasoning pipeline.`;
    }

    return {
      isSafe,
      threatLevel: highestSeverity,
      detectedPatterns,
      attackType: primaryAttackType,
      sanitizedInput: sanitized,
      defenseExplanation,
    };
  }

  /**
   * Enforces prompt isolation using strict XML/Delimiter encapsulation
   */
  public static wrapInSafeDelimiter(sanitizedText: string): string {
    return `<<<SAFE_USER_INTENT>>>\n${sanitizedText.replace(/<{3,}/g, '')}\n<<</SAFE_USER_INTENT>>>`;
  }

  /**
   * Verifies that the generated itinerary respects all hard constraints
   */
  public static verifyConstraintCompliance(
    budgetAllocated: number,
    budgetCap: number,
    durationDays: number,
    actualDays: number
  ): { compliant: boolean; errors: string[] } {
    const errors: string[] = [];

    if (budgetAllocated > budgetCap) {
      errors.push(`Budget violation: Allocated ₹${budgetAllocated.toLocaleString()} exceeds hard cap of ₹${budgetCap.toLocaleString()}`);
    }

    if (actualDays !== durationDays) {
      errors.push(`Duration violation: Generated ${actualDays} days instead of requested ${durationDays} days`);
    }

    return {
      compliant: errors.length === 0,
      errors,
    };
  }
}
