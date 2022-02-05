import { IPipeline, IPlugin, IConfiguration } from 'coderr.client';
import { RequestCollectionProvider, RequestHeadersCollectionProvider } from './collections/request';
import { RouteCollectionProvider } from './collections/route';

export * from './collections/request';
export * from './collections/route';

export * from './middlewares/coderr';
export * from './middlewares/error';

export * from './error';
export * from './context';
import { assignPipeline } from './reporting';

/**
 * Use the errorMiddleware and/or coderrMiddleware to get started.
 */

class ExpressJsPlugin implements IPlugin {
    register(p: IPipeline): void {
        assignPipeline(p);
        p.configuration.contextProviders.push(new RequestCollectionProvider());
        p.configuration.contextProviders.push(new RequestHeadersCollectionProvider());
        p.configuration.contextProviders.push(new RouteCollectionProvider());
    }
}

export function activatePlugin(config: IConfiguration) {
    if (!config){
        throw new Error("Config was not specified.");
    }

    config.plugins.push(new ExpressJsPlugin());
}
