import { NgModule, Optional, SkipSelf, ModuleWithProviders } from '@angular/core';

@NgModule()
export class CoreModule {

    public constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
        if (parentModule) {
            throw new Error('infrastructore模块使用forRoot()引用,其他模块不需要再引用了!');
        }
    }

    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CoreModule,
            providers: [
      
            ]
        };
    }
}
