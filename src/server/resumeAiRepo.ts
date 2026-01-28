import { db } from '@/lib/db';
import { SectionKeyType } from '@/lib/ai/outputSchemas';

/**
 * Get or create draft for a requestId
 */
export async function getOrCreateDraft(userId: string, requestId: string): Promise<number> {
    let draft = db.resumeDrafts.findByRequestId(requestId);

    if (!draft) {
        draft = db.resumeDrafts.create({
            user_id: parseInt(userId, 10),
            request_id: requestId,
            status: 'generating',
        });
    }

    return draft.id;
}

export async function setResumeDirty(draftId: number, dirty: boolean): Promise<void> {
    db.resumeDrafts.update(draftId, { resume_dirty: dirty });
}

export async function markDraftStatus(params: { draftId: number; status: 'generating' | 'ready' | 'error' }) {
    db.resumeDrafts.update(params.draftId, { status: params.status });
}

export async function saveSectionOutput(params: {
    draftId: number;
    sectionKey: SectionKeyType;
    outputJson: any;
    model: string;
    inputHash: string;
    userOverrideJson?: any;
    userOverrideText?: string | null;
    generationMode?: string;
}): Promise<void> {
    const effectiveOutput = params.userOverrideJson || params.outputJson;
    const existing = db.resumeSectionOutputs.findByDraftIdAndSection(params.draftId, params.sectionKey);

    const outputData: any = {
        ai_output_json: typeof params.outputJson === 'string' ? params.outputJson : JSON.stringify(params.outputJson),
        user_override_json: params.userOverrideJson
            ? typeof params.userOverrideJson === 'string'
                ? params.userOverrideJson
                : JSON.stringify(params.userOverrideJson)
            : null,
        user_override_text: params.userOverrideText ?? null,
        effective_output_json:
            typeof effectiveOutput === 'string' ? effectiveOutput : JSON.stringify(effectiveOutput ?? {}),
        model: params.model,
        input_hash: params.inputHash,
        generation_mode: params.generationMode || 'default',
    };

    if (existing) {
        db.resumeSectionOutputs.update(existing.id, outputData);
        return;
    }

    db.resumeSectionOutputs.create({
        draft_id: params.draftId,
        section_key: params.sectionKey,
        ...outputData,
    });
}

export async function getAllSectionOutputs(draftId: number): Promise<Record<string, any>> {
    const outputs = db.resumeSectionOutputs.findByDraftId(draftId);
    const result: Record<string, any> = {};

    for (const output of outputs) {
        try {
            const jsonToParse = output.effective_output_json || output.output_json || output.ai_output_json;
            const parsed = typeof jsonToParse === 'string' ? JSON.parse(jsonToParse) : jsonToParse;
            result[output.section_key] = parsed;
        } catch {
            // ignore parse errors
        }
    }

    return result;
}

