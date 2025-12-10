import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error("API Key is missing in environment variables");
      return NextResponse.json(
        { error: "API key is missing" },
        { status: 500 }
      );
    }

    console.log("API Key loaded (starts with):", apiKey.substring(0, 4) + "****");

    const genAI = new GoogleGenerativeAI(apiKey);
    
    const systemInstruction = `
당신은 한국의 정비사업(재개발, 재건축) 전문가인 'TERMIT AI'입니다.
사용자의 질문에 대해 전문적이고 정확하며 친절하게 답변해 주세요.

[핵심 지식 가이드]
1. **정비사업의 종류**:
   - **재개발 (Redevelopment)**: 정비기반시설이 열악하고 노후·불량건축물이 밀집한 지역에서 주거환경을 개선하거나 상업·공업지역 등의 도시기능을 회복하기 위한 사업입니다. (공공성이 강함)
   - **재건축 (Reconstruction)**: 정비기반시설은 양호하나 노후·불량건축물이 밀집한 공동주택단지에서 주거환경을 개선하기 위한 사업입니다. (민간 성격이 강함)

2. **일반적인 추진 절차**:
   기본계획 수립 -> 정비구역 지정 -> 추진위원회 승인 -> 조합설립인가 -> 시공사 선정 -> 사업시행인가 -> 종전자산평가 -> 분양신청 -> 관리처분계획인가 -> 이주 및 철거 -> 착공 및 일반분양 -> 준공인가 -> 이전고시 및 청산.

3. **주요 용어 설명**:
   - **비례율**: 사업의 수익성을 나타내는 지표. ((총 수입 - 총 지출) / 종전자산 총 평가액) * 100
   - **감정평가액**: 조합원이 보유한 기존 자산의 평가 금액.
   - **권리가액**: 감정평가액 * 비례율. 실제 새 아파트를 받을 때 인정받는 금액.
   - **분담금**: 조합원이 새 아파트를 받기 위해 추가로 내야 하는 돈. (조합원 분양가 - 권리가액)
   
[답변 원칙]
- 정비사업과 관련되지 않은 질문에는 "저는 정비사업 전문가이므로 해당 질문에는 답변드리기 어렵습니다."라고 정중히 거절하세요.
- 복잡한 법률 정보는 "정확한 내용은 법률 전문가나 관할 구청에 확인하시기 바랍니다"라는 면책 조항을 함께 부가하는 것이 좋습니다.
- 답변은 마크다운 형식으로 깔끔하게 정리해서 제공하세요.
`;

    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", 
        systemInstruction: systemInstruction
    });

    console.log("Attempting to generate content with prompt:", prompt.substring(0, 50) + "...");
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Generation successful");

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Error generating content:", error);
    // Build a more informative error message
    const errorMessage = error.message || "Unknown error";
    const errorDetails = error.stack || "";
    console.error("Error details:", errorMessage, errorDetails);
    
    return NextResponse.json(
      { error: `Failed to generate content: ${errorMessage}` },
      { status: 500 }
    );
  }
}
