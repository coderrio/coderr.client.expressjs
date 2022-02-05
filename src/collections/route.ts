import * as coderr from 'coderr.client';
import { NodeJsContext } from '../context';

/**
 * Collections information about the current route in a collection named `Route`.
 */
export class RouteCollectionProvider
    implements coderr.contextCollections.IContextCollectionProvider
{
    collect(context: coderr.contextCollections.IContextCollectionProviderContext): void {
        if (context.contextType != NodeJsContext.NAME) {
            return;
        }

        var nodeJsContext = <NodeJsContext>context;
        if (!nodeJsContext.request || !nodeJsContext.request.route) {
            return;
        }

        var collection = coderr.contextCollections.toCollection(
            'Route',
            nodeJsContext.request.route
        );
        context.contextCollections.push(collection);
    }
}
