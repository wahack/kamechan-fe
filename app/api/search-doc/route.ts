import { fetchHotNode, searchDocByKeyword } from "@/db/services/nodeDoc";
import { NextRequest, NextResponse } from "next/server";
import { isEmpty, omit } from "radash";

export const GET = async(req: NextRequest) => {
  let keyword = req.nextUrl.searchParams.get("keyword");
  // if (!keyword) return NextResponse.json({code: 400, message: "keyword required"});

  const list = keyword ? await searchDocByKeyword(keyword, 30) : await fetchHotNode([
    'eaa98acf-7656-4750-ad57-867e1a5547ef',
    '4f5b30e9-d0c9-40bd-a1d5-71819edfed00',
    '5cd453d6-48d0-421f-8b3c-35a8396865eb',
    '702dcf26-2a14-4172-a40c-560ecb1c0b32',
    'b87c1882-16bb-4c64-b7ab-a5a4316de97f',
    'd33af63c-d6f3-48e5-a8a0-639e7aedc68d',
    '51cf724a-50ae-4115-a503-d88bbd07a020',
    '6dc31df6-f0ed-435f-b69f-7580c42f7871',
    'e9abe42f-5f66-4921-b9d1-fd581d3ee291',
    'bceccd49-937b-47b3-9241-d49a28e02bc0',
    '3fb90e2a-2e68-4aa3-b2e2-a1441e489f32',
    '28668c3b-9740-4069-bac1-3e4a4e1f04ea',
    '96ed06a2-a4d2-4246-9e54-d6aac188fc1b',
    'ae84a371-948f-4da3-9ea2-e41aa25af593'
  ]);

  return NextResponse.json({
    code: 0,
    data: list.map(item => {
      const content = JSON.parse(item.content!)
      return {
        ...item,
        summary: content.Summary,
        params: Object.entries(Object.assign(omit(content, ['Summary', 'credentials', 'params' ]), content.params || {})).map(([key, value]) => {
          if (isEmpty(value)) return false
          return {
            label: key,
            value: JSON.stringify(value)
          }
        }).filter(i =>i)
      }
    })
  })

}