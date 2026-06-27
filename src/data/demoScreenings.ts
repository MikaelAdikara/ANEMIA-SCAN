import type {
  FollowUpStatus,
  ImageQuality,
  IsoTimestamp,
  RiskForm,
  RiskLevel,
  ScreeningRecord,
  TargetGroup,
} from '../domain/types'

export const DEMO_DATA_LABEL = 'Data demo sintetis'

interface DemoScreeningSeedBase {
  startedAt: IsoTimestamp
  siteId: string
  targetGroup: TargetGroup
  followUpStatus: FollowUpStatus
  eyeQuality: ImageQuality
  nailQuality: ImageQuality
}

interface CompletedDemoScreeningSeed extends DemoScreeningSeedBase {
  completionState: 'completed'
  completedAt: IsoTimestamp
  durationSeconds: number
  riskScore: number
  riskLevel: RiskLevel
}

interface IncompleteDemoScreeningSeed extends DemoScreeningSeedBase {
  completionState: 'incomplete'
  riskFormPattern: RiskLevel
}

type DemoScreeningSeed = CompletedDemoScreeningSeed | IncompleteDemoScreeningSeed

const DEMO_SCREENING_SEEDS = [
  {
    startedAt: '2026-06-26T08:05:00+07:00',
    completedAt: '2026-06-26T08:09:12+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.18,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 252,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-26T09:18:00+07:00',
    completedAt: '2026-06-26T09:23:06+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.52,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 306,
    followUpStatus: 'scheduled',
    eyeQuality: 'acceptable',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-26T10:32:00+07:00',
    completedAt: '2026-06-26T10:38:24+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.82,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 384,
    followUpStatus: 'scheduled',
    eyeQuality: 'good',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-26T13:47:00+07:00',
    completedAt: '2026-06-26T13:51:21+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.24,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 261,
    followUpStatus: 'not-required',
    eyeQuality: 'acceptable',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-25T08:11:00+07:00',
    completedAt: '2026-06-25T08:15:38+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.47,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 278,
    followUpStatus: 'recommended',
    eyeQuality: 'poor',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-25T09:26:00+07:00',
    completedAt: '2026-06-25T09:33:02+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.88,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 422,
    followUpStatus: 'completed',
    eyeQuality: 'acceptable',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-25T11:04:00+07:00',
    completedAt: '2026-06-25T11:07:45+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.14,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 225,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-25T14:19:00+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    completionState: 'incomplete',
    riskFormPattern: 'moderate',
    followUpStatus: 'recommended',
    eyeQuality: 'unusable',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-24T08:22:00+07:00',
    completedAt: '2026-06-24T08:28:15+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.76,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 375,
    followUpStatus: 'scheduled',
    eyeQuality: 'acceptable',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-24T09:41:00+07:00',
    completedAt: '2026-06-24T09:45:32+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.29,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 272,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-24T13:08:00+07:00',
    completedAt: '2026-06-24T13:13:48+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.55,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 348,
    followUpStatus: 'completed',
    eyeQuality: 'acceptable',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-23T08:16:00+07:00',
    completedAt: '2026-06-23T08:23:50+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.91,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 470,
    followUpStatus: 'lost-to-follow-up',
    eyeQuality: 'poor',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-23T10:27:00+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    completionState: 'incomplete',
    riskFormPattern: 'low',
    followUpStatus: 'recommended',
    eyeQuality: 'unusable',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-23T14:03:00+07:00',
    completedAt: '2026-06-23T14:08:51+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.58,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 351,
    followUpStatus: 'scheduled',
    eyeQuality: 'good',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-22T08:37:00+07:00',
    completedAt: '2026-06-22T08:43:44+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.73,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 404,
    followUpStatus: 'completed',
    eyeQuality: 'acceptable',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-22T10:12:00+07:00',
    completedAt: '2026-06-22T10:15:56+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.16,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 236,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-22T13:29:00+07:00',
    completedAt: '2026-06-22T13:34:27+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.44,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 327,
    followUpStatus: 'recommended',
    eyeQuality: 'acceptable',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-20T08:54:00+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    completionState: 'incomplete',
    riskFormPattern: 'high',
    followUpStatus: 'scheduled',
    eyeQuality: 'poor',
    nailQuality: 'unusable',
  },
  {
    startedAt: '2026-06-20T10:38:00+07:00',
    completedAt: '2026-06-20T10:42:03+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.31,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 243,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-20T14:26:00+07:00',
    completedAt: '2026-06-20T14:32:31+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.61,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 391,
    followUpStatus: 'lost-to-follow-up',
    eyeQuality: 'acceptable',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-18T08:13:00+07:00',
    completedAt: '2026-06-18T08:20:05+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.79,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 425,
    followUpStatus: 'scheduled',
    eyeQuality: 'poor',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-18T09:49:00+07:00',
    completedAt: '2026-06-18T09:54:17+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.27,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 317,
    followUpStatus: 'completed',
    eyeQuality: 'acceptable',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-18T13:36:00+07:00',
    completedAt: '2026-06-18T13:41:42+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.49,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 342,
    followUpStatus: 'recommended',
    eyeQuality: 'good',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-16T08:28:00+07:00',
    completedAt: '2026-06-16T08:36:09+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.94,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 489,
    followUpStatus: 'completed',
    eyeQuality: 'acceptable',
    nailQuality: 'unusable',
  },
  {
    startedAt: '2026-06-16T10:07:00+07:00',
    completedAt: '2026-06-16T10:10:38+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.12,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 218,
    followUpStatus: 'not-required',
    eyeQuality: 'good',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-16T13:52:00+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    completionState: 'incomplete',
    riskFormPattern: 'moderate',
    followUpStatus: 'recommended',
    eyeQuality: 'unusable',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-12T08:46:00+07:00',
    completedAt: '2026-06-12T08:53:02+07:00',
    siteId: 'SITE-SBY-01',
    targetGroup: 'adolescent',
    riskScore: 0.71,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 422,
    followUpStatus: 'lost-to-follow-up',
    eyeQuality: 'poor',
    nailQuality: 'poor',
  },
  {
    startedAt: '2026-06-12T10:31:00+07:00',
    completedAt: '2026-06-12T10:35:09+07:00',
    siteId: 'SITE-YGY-01',
    targetGroup: 'pregnant',
    riskScore: 0.22,
    riskLevel: 'low',
    completionState: 'completed',
    durationSeconds: 249,
    followUpStatus: 'not-required',
    eyeQuality: 'acceptable',
    nailQuality: 'good',
  },
  {
    startedAt: '2026-06-09T09:14:00+07:00',
    completedAt: '2026-06-09T09:19:37+07:00',
    siteId: 'SITE-JKT-01',
    targetGroup: 'adolescent',
    riskScore: 0.57,
    riskLevel: 'moderate',
    completionState: 'completed',
    durationSeconds: 337,
    followUpStatus: 'scheduled',
    eyeQuality: 'acceptable',
    nailQuality: 'acceptable',
  },
  {
    startedAt: '2026-06-05T11:40:00+07:00',
    completedAt: '2026-06-05T11:47:26+07:00',
    siteId: 'SITE-BDG-01',
    targetGroup: 'pregnant',
    riskScore: 0.83,
    riskLevel: 'high',
    completionState: 'completed',
    durationSeconds: 446,
    followUpStatus: 'completed',
    eyeQuality: 'poor',
    nailQuality: 'acceptable',
  },
] as const satisfies readonly DemoScreeningSeed[]

function createRiskForm(
  targetGroup: TargetGroup,
  riskLevel: RiskLevel,
  index: number,
): RiskForm {
  const common = {
    ageYears: targetGroup === 'adolescent' ? 12 + (index % 7) : 20 + (index % 16),
    symptoms: {
      fatigue: riskLevel !== 'low',
      dizziness: riskLevel === 'high' || (riskLevel === 'moderate' && index % 2 === 0),
      shortnessOfBreath: riskLevel === 'high' && index % 2 === 0,
      visiblePallor: riskLevel === 'high' || (riskLevel === 'moderate' && index % 3 === 0),
    },
    animalProteinServingsPerWeek:
      riskLevel === 'high' ? 1 + (index % 2) : riskLevel === 'moderate' ? 2 + (index % 3) : 4 + (index % 3),
    ironSupplementUse:
      riskLevel === 'low' ? ('regular' as const) : riskLevel === 'moderate' ? ('irregular' as const) : ('none' as const),
    recentBleeding: riskLevel === 'high' && index % 3 === 0,
    previousAnemia: riskLevel === 'high' || (riskLevel === 'moderate' && index % 4 === 0),
  }

  if (targetGroup === 'adolescent') {
    const menstruates = common.ageYears >= 13

    return {
      ...common,
      targetGroup,
      menstruates,
      heavyMenstrualBleeding: menstruates ? riskLevel === 'high' : null,
    }
  }

  return {
    ...common,
    targetGroup,
    gestationalAgeWeeks: 8 + ((index * 3) % 32),
    parity: index % 4,
    muacCategory:
      riskLevel === 'high' || (riskLevel === 'moderate' && index % 2 === 0)
        ? 'below-23.5-cm'
        : 'at-or-above-23.5-cm',
  }
}

export const DEMO_SCREENINGS: readonly ScreeningRecord[] = DEMO_SCREENING_SEEDS.map(
  (seed, index): ScreeningRecord => {
    const riskFormPattern =
      seed.completionState === 'completed' ? seed.riskLevel : seed.riskFormPattern
    const commonRecord = {
      id: `SCR-${String(index + 1).padStart(4, '0')}` as const,
      siteId: seed.siteId,
      startedAt: seed.startedAt,
      targetGroup: seed.targetGroup,
      riskForm: createRiskForm(seed.targetGroup, riskFormPattern, index),
      imageQuality: {
        eye: seed.eyeQuality,
        nail: seed.nailQuality,
      },
      followUpStatus: seed.followUpStatus,
    }

    if (seed.completionState === 'incomplete') {
      return {
        ...commonRecord,
        completionState: seed.completionState,
      }
    }

    return {
      ...commonRecord,
      completionState: seed.completionState,
      completedAt: seed.completedAt,
      durationSeconds: seed.durationSeconds,
      riskScore: seed.riskScore,
      riskLevel: seed.riskLevel,
    }
  },
)
