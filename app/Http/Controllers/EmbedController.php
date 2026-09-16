<?php

namespace App\Http\Controllers;

use Illuminate\Http\Response;

class EmbedController extends Controller
{
    public function youtube(string $videoId): Response
    {
        $html = <<<HTML
        <!DOCTYPE html>
        <html>
          <head>
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * {
                margin: 0;
                padding: 0;
              }

              html, body {
                width: 100%;
                height: 100%;
                background: #000;
                overflow: hidden;
              }

              iframe {
                width: 100%;
                height: 100%;
                border: none;
              }
            </style>
          </head>

          <body>
            <iframe
              src="https://www.youtube.com/embed/{$videoId}?playsinline=1"
              title="YouTube video player"
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowfullscreen>
            </iframe>
          </body>
        </html>
        HTML;

        return response($html)->header('Content-Type', 'text/html');
    }
}
