<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;

class OpenAiController extends Controller
{
    public function __construct()
    {
        if (config('openai.limit')) {
            $this->middleware('throttle:openai')->only('chat');
        }
    }

    public function chat(Request $request)
    {
        return response()->stream(function () use ($request) {
            $response = OpenAI::chat()->createStreamed([
                'model' => config('openai.model'),
                'messages' => $request->input('messages', []),
            ]);

            foreach ($response as $chunk) {
                if (connection_aborted()) {
                    return;
                }

                echo $chunk->choices[0]->delta->content;

                ob_flush();
                flush();
            }
        }, headers: [
            'X-Accel-Buffering' => 'no',
            'Cache-Control' => 'no-cache',
            'Content-Type' => 'text/plain; charset=UTF-8',
        ]);
    }
}
