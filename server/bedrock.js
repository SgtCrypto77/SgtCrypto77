import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime";

/** Basic Bedrock chat wrapper; adjust modelId to your model (e.g., anthropic.claude-3-5-sonnet) */
const client = new BedrockRuntimeClient({ region: process.env.AWS_REGION || "us-east-1" });

export async function bedrockChat({ system, user }) {
  const modelId = process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-sonnet-20240229-v1:0";
  const body = JSON.stringify({
    anthropic_version: "bedrock-2023-05-31",
    max_tokens: 1500,
    system,
    messages: [{ role: "user", content: [{ type: "text", text: user }] }]
  });
  const res = await client.send(new InvokeModelCommand({
    modelId, contentType: "application/json", accept: "application/json", body
  }));
  const json = JSON.parse(new TextDecoder().decode(res.body));
  // Anthropic-style response:
  const text = json?.content?.[0]?.text || "";
  return text;
}
