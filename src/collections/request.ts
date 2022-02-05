import * as coderr from 'coderr.client';
import { NodeJsContext } from '../context';
import { StringDictionary } from 'coderr.client/dist/tsc/context-collections';

/**
 * Collects information from the HTTP request and generates a collection named `Request`.
 */
export class RequestCollectionProvider
    implements coderr.contextCollections.IContextCollectionProvider
{
    collect(context: coderr.contextCollections.IContextCollectionProviderContext): void {
        if (context.contextType != NodeJsContext.NAME) {
            return;
        }

        var nodeJsContext = <NodeJsContext>context;
        if (!nodeJsContext.request) {
            return;
        }

        var properties: StringDictionary = {};
        properties['url'] = nodeJsContext.request.url;
        properties['baseUrl'] = nodeJsContext.request.baseUrl;
        properties['fresh'] = nodeJsContext.request.fresh.toString();
        properties['hostname'] = nodeJsContext.request.hostname;
        properties['ip'] = nodeJsContext.request.ip;
        properties['originalUrl'] = nodeJsContext.request.originalUrl;
        properties['path'] = nodeJsContext.request.path;
        properties['protocol'] = nodeJsContext.request.protocol;
        properties['xhr'] = nodeJsContext.request.xhr.toString();

        if (nodeJsContext.request.query){
            properties['query'] = JSON.stringify(nodeJsContext.request.query);
        }

        if (nodeJsContext.request.subdomains && nodeJsContext.request.subdomains.length > 0){
            properties['subdomains'] = nodeJsContext.request.subdomains.join(", ");
        }

        properties['cookies'] = JSON.stringify(nodeJsContext.request.cookies);

        var collection: coderr.contextCollections.IContextCollection = {
            name: 'Request',
            properties: properties,
        };

        context.contextCollections.push(collection);
    }
}

/**
 * Collects information from the HTTP request and generates a collection named `RequestHeaders`.
 */
 export class RequestHeadersCollectionProvider
 implements coderr.contextCollections.IContextCollectionProvider
{
 collect(context: coderr.contextCollections.IContextCollectionProviderContext): void {
     if (context.contextType != NodeJsContext.NAME) {
         return;
     }

     var nodeJsContext = <NodeJsContext>context;
     if (!nodeJsContext.request) {
         return;
     }

     var properties: StringDictionary = {};
     for (const key in nodeJsContext.request.headers) {
         var value = nodeJsContext.request.headers[key];
         if (!value) {
             continue;
         }
         if (key == 'cookie') {
             continue;
         }

         if (typeof value === 'string') {
             properties[key] = value;
         } else {
             properties[key] = value.join(', ');
         }
     }

     var collection: coderr.contextCollections.IContextCollection = {
         name: 'RequestHeaders',
         properties: properties,
     };

     context.contextCollections.push(collection);
 }
}
