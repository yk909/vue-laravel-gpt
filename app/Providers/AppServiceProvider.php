<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->extend(\OpenAI\Contracts\ClientContract::class, static function (): \OpenAI\Client {
            $apiKey = config('openai.api_key');
            $organization = config('openai.organization');
            $baseUri = config('openai.base_uri');

            if (! is_string($apiKey) || ($organization !== null && ! is_string($organization))) {
                throw \OpenAI\Laravel\Exceptions\ApiKeyIsMissing::create();
            }

            return \OpenAI::factory()
                ->withApiKey($apiKey)
                ->withOrganization($organization)
                ->withBaseUri($baseUri)
                ->withHttpHeader('OpenAI-Beta', 'assistants=v1')
                ->withHttpClient(new \GuzzleHttp\Client(['timeout' => config('openai.request_timeout', 30)]))
                ->make();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
