<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Observers\ContactObserver;
use App\Observers\ManagementObserver;
use App\Observers\SpecialCaseObserver;
use App\Observers\EntityObserver;
use App\Models\Contact;
use App\Models\Management;
use App\Models\SpecialCases;
use App\Models\Entity;
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
        Contact::observe(ContactObserver::class);
        Management::observe(ManagementObserver::class);
        SpecialCases::observe(SpecialCaseObserver::class);
        Entity::observe(EntityObserver::class);
    }
}
