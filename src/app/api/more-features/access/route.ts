import { NextRequest, NextResponse } from 'next/server';

import { consumeCredit } from '@/lib/credits';
import { getUserIdFromAuth } from '@/lib/auth/get-user-id';
import { getResumeFeatureCoinCost } from '@/lib/pricing/get-resume-feature-coin-cost';
import {
  disableMoreFeature,
  featureKeyFromName,
  getMoreFeaturesAccessByUserId,
  isMoreFeatureUnlocked,
  unlockAndEnableMoreFeature,
} from '@/lib/more-features/access-store';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Cache-Control': 'no-store, max-age=0',
};

type PostBody =
  | { action: 'enable'; featureName: string }
  | { action: 'disable'; featureName: string };

export async function GET(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders });
  }

  const access = getMoreFeaturesAccessByUserId(Number(userId));
  return NextResponse.json({ data: access }, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  const userId = await getUserIdFromAuth(request);
  if (!userId) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401, headers: corsHeaders });
  }

  let body: PostBody | null = null;
  try {
    body = (await request.json()) as PostBody;
  } catch {
    body = null;
  }

  const action = (body as any)?.action;
  const featureName = String((body as any)?.featureName ?? '').trim();
  const featureKey = featureKeyFromName(featureName);

  if ((action !== 'enable' && action !== 'disable') || !featureName || !featureKey) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400, headers: corsHeaders });
  }

  const uid = Number(userId);

  if (action === 'disable') {
    const access = disableMoreFeature(uid, featureKey);
    return NextResponse.json({ data: { access, featureKey } }, { headers: corsHeaders });
  }

  // action === 'enable'
  const alreadyUnlocked = isMoreFeatureUnlocked(uid, featureKey);

  if (!alreadyUnlocked) {
    // Deduct coin cost ONCE when unlocking.
    const coinCost = getResumeFeatureCoinCost(featureName, 0);
    if (coinCost > 0) {
      const creditResult = await consumeCredit(uid, coinCost, featureKey || 'more_feature');
      if (!creditResult.success) {
        return NextResponse.json(
          {
            error: creditResult.error || 'Insufficient credits',
            remainingCredits: creditResult.remainingCredits,
            requiredCredits: coinCost,
            featureKey,
          },
          { status: 402, headers: corsHeaders },
        );
      }
    }
  }

  const access = unlockAndEnableMoreFeature(uid, featureKey);
  return NextResponse.json({ data: { access, featureKey } }, { headers: corsHeaders });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: { ...corsHeaders, 'Access-Control-Max-Age': '86400' },
  });
}

