<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

// CONTACTOS - OBSERVERS
use App\Observers\Affiliate\AffiliateContactObserver;
use App\Observers\Alliance\AllianceContactObserver;

// GESTIONES - OBSERVERS
use App\Observers\Affiliate\AffiliateManagementObserver;
use App\Observers\Alliance\AllianceManagementObserver;

// CASOS ESPECIALES - OBSERVERS
use App\Observers\Affiliate\AffiliateSpecialCaseObserver;
use App\Observers\Alliance\AllianceSpecialCaseObserver;

// CONTACTOS - MODELS
use App\Models\Contact;

// GESTIONES - MODELS
use App\Models\Aliados\Management as ManagementAliados;
use App\Models\Afiliados\Management as ManagementAfiliados;

// CASOS ESPECIALES - MODELS
use App\Models\SpecialCases;
class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot()
    {
        // contactos
        AllianceContact::observe(AllianceContactObserver::class);
        AffiliateContact::observe(AffiliateContactObserver::class);

        // gestiones
        AllianceManagement::observe(AllianceManagementObserver::class);
        AffiliateManagement::observe(AffiliateManagementObserver::class);

        // casos especiales
        AllianceSpecialCases::observe(AllianceSpecialCaseObserver::class);
        AffiliateSpecialCases::observe(AffiliateSpecialCaseObserver::class);
    }
}
