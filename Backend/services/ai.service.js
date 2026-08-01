import { GoogleGenAI } from "@google/genai";
import { ApiError } from "../utils/ApiError.js";
import crypto from "crypto";

let client = null;

// ──── Cache Configuration ────
const CACHE = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

// Generate a hash key for caching
const generateCacheKey = (prompt, model, temperature = null) => {
    const data = `${prompt}|${model}|${temperature || ""}`;
    return crypto.createHash("sha256").update(data).digest("hex");
};

// Check cache and clean expired entries
const getCachedResult = (cacheKey) => {
    const cached = CACHE.get(cacheKey);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > CACHE_TTL) {
        CACHE.delete(cacheKey);
        return null;
    }

    console.log("[Cache HIT]", cacheKey.slice(0, 8));
    return cached.data;
};

// Store result in cache
const setCachedResult = (cacheKey, data) => {
    CACHE.set(cacheKey, { data, timestamp: Date.now() });
};

const getClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new ApiError(500, "GEMINI_API_KEY is not defined in env. variable");
    };
    if (!client) {
        client = new GoogleGenAI({ apiKey });
    }
    return client;
};

const MODEL = () => process.env.GEMINI_MODEL || "gemini-3.5-flash";

export const isAIConfigured = () => Boolean(process.env.GEMINI_API_KEY);

const generateJSON = async (prompt, schema) => {
    const cacheKey = generateCacheKey(prompt, MODEL(), 0.6);

    // Check cache first
    const cached = getCachedResult(cacheKey);
    if (cached) return cached;

    const ai = getClient();
    try {
        console.log("MODEL =", MODEL());
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.6,
            },
        });
        const result = JSON.parse(response.text);
        setCachedResult(cacheKey, result);
        return result;
    } catch (err) {
        console.error("Error generating JSON:", err?.message || err);
        throw new ApiError(502, "Error generating JSON from AI service");
    }
};

const generateText = async (prompt, temperature = 0.7) => {
    const cacheKey = generateCacheKey(prompt, MODEL(), temperature);

    // Check cache first
    const cached = getCachedResult(cacheKey);
    if (cached) return cached;

    const ai = getClient();
    try {
        console.log("MODEL =", MODEL());
        const response = await ai.models.generateContent({
            model: MODEL(),
            contents: prompt,
            config: { temperature },
        });
        const result = response.text.trim();
        setCachedResult(cacheKey, result);
        return result;
    } catch (err) {
        console.error("Error generating text:", err?.message || err);
        throw new ApiError(502, "Error generating text from AI service");
    }
};

export const generateLeadSummary = async (lead) => {
    const prompt = `You are an expert B2B sales analyst for a CRM called AICRM.
Analyze the following sales lead and produce a concise assessment.

Lead details:
- Name: ${lead.name || "N/A"}
- Company: ${lead.company || "N/A"}
- Email: ${lead.email || "N/A"}
- Current pipeline stage: ${lead.status || "New"}
- Potential deal value: ${lead.value || 0}
- Source: ${lead.source || "Unknown"}
- Notes: ${lead.notes || "None"}

Return JSON only.`;

    const schema = {
        type: "object",
        properties: {
            summary: {
                type: "string",
                description: "2-3 sentence executive summary of the lead",
            },
            riskScore: {
                type: "integer",
                description: "Risk of losing this deal, 0 (safe) to 100 (high risk)",
            },
            suggestedPriority: {
                type: "string",
                enum: ["Low", "Medium", "High"],
            },
            nextBestAction: {
                type: "string",
                description: "One concrete recommended next step",
            },
        },
        required: [
            "summary",
            "riskScore",
            "suggestedPriority",
            "nextBestAction",
        ],
    };

    return generateJSON(prompt, schema);
};

export const generateEmail = async ({ lead, purpose, tone, sender }) => {
    const prompt = `You are a senior sales rep writing on behalf of ${sender?.name || "our team"} ${sender?.company ? ` at ${sender.company}` : ""}.

Write a professional sales email.
Purpose: ${purpose || "follow-up"}
Desired tone: ${tone || "friendly and persuasive"}

Recipient (lead) details:
- Name: ${lead?.name || "there"}
- Company: ${lead?.company || "N/A"}
- Pipeline stage: ${lead?.status || "New"}
- Context / notes: ${lead?.notes || "None"}

Return JSON only with a compelling subject line and a complete email body.
Use line breaks (\\n) in the body. Keep it under 180 words. Sign off as ${sender?.name || "the AICRM Team"}.`;

    const schema = {
        type: "object",
        properties: {
            subject: {
                type: "string"
            },
            body: {
                type: "string"
            },
        },
        required: ["subject", "body"],
    };

    return generateJSON(prompt, schema);
};

export const generateSalesInsights = async (pipelineStats) => {
    const prompt = `You are a revenue-operations advisor. Given this snapshot of a sales
    pipeline, identify what is working, what is at risk, and concrete actions to improve conversion.

Pipeline snapshot (JSON):

${JSON.stringify(pipelineStats, null, 2)}

Return JSON only.`;

    const schema = {
        type: "object",
        properties: {
            headline: {
                type: "string",
                description: "One-sentence summary of Pipeline health",
            },
            insights: {
                type: "array",
                description: "3-5 specific, data-driven observations",
                items: {
                    type: "string",
                },
            },
            recommendations: {
                type: "array",
                description: "3-5 prioritized, actionable recommendations",
                items: {
                    type: "string",
                },
            },
            healthScore: {
                type: "integer",
                description: "Overall pipeline health, 0-100",
            },
        },
        required: [
            "headline",
            "insights",
            "recommendations",
            "healthScore",
        ],
    };

    return generateJSON(prompt, schema);
};

// const ai = getClient();

// const models = await ai.models.list();

// for await (const model of models) {
//     console.log(model.name);
// }

// ──── Cache Management ────
export const getCacheStats = () => {
    let totalSize = 0;
    let expiredCount = 0;

    for (const [key, cached] of CACHE.entries()) {
        if (Date.now() - cached.timestamp > CACHE_TTL) {
            expiredCount++;
            CACHE.delete(key);
        } else {
            totalSize++;
        }
    }

    return {
        activeEntries: totalSize,
        expiredEntriesRemoved: expiredCount,
        totalCacheSize: CACHE.size,
    };
};

export const clearCache = () => {
    const size = CACHE.size;
    CACHE.clear();
    console.log(`[Cache] Cleared ${size} entries`);
    return size;
};

// const ai = getClient();

// const models = await ai.models.list();

// for await (const model of models) {
//   console.log(model.name);
// }

export { generateText };