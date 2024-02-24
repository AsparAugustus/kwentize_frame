import { FrameRequest, getFrameMessage, getFrameHtmlResponse } from '@coinbase/onchainkit/frame';
import { NextRequest, NextResponse } from 'next/server';
import { NEXT_PUBLIC_URL } from '../../config';
import { NeynarAPIClient, isApiErrorResponse } from "@neynar/nodejs-sdk";
import axios from "axios";

const apiKey = process.env.NEYNAR_APIKEY;
if (apiKey) {
  const client = new NeynarAPIClient(apiKey);
  // Use client
} else {
  // Handle the missing API key case, e.g., throw an error or log a warning
  console.error("No API key found")
}
async function getResponse(req: NextRequest): Promise<NextResponse> {

  const response = axios.post('https://api.neynar.com/v2/farcaster/frame/validate', {
    cast_reaction_context: true,
    follow_context: false
  }, {
    headers: {
      'accept': 'application/json',
      'api_key': 'NEYNAR_API_DOCS',
      'content-type': 'application/json'
    }
  })

  console.log(response)



  let accountAddress: string | undefined = '';
  let text: string | undefined = '';

  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: 'NEYNAR_ONCHAIN_KIT' });

  if (isValid) {
    accountAddress = message.interactor.verified_accounts[0];
  }

  if (message?.input) {
    text = message.input;
  }

  if (message?.button === 3) {
    return NextResponse.redirect(
      'https://www.google.com/search?q=cute+dog+pictures&tbm=isch&source=lnms',
      { status: 302 },
    );
  }

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `Story: ${text} 🌲🌲`,
        },
      ],
      image: {
        src: `${NEXT_PUBLIC_URL}/park-1.png`,
      },
      postUrl: `${NEXT_PUBLIC_URL}/api/frame`,
    }),
  );
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = 'force-dynamic';
