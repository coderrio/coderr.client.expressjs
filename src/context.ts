import * as coderr from 'coderr.client';
import { Request, Response } from 'express';

/**
 * An error which was caught within ExpressJs.
 *
 * Provides access to expressJS and uses the npm_package_version as application version.
 * Use `NodeJsContext.NAME` to validate that its an NodeJSContext.
 */
export class NodeJsContext implements coderr.contextCollections.IContextCollectionProviderContext {
    public static NAME = 'nodejs';
    constructor(public source: any, public error: Error) {
        coderr.features.addTag(this.contextCollections, 'nodejs');
        var coderrCollection = coderr.contextCollections.getCoderrCollection(
            this.contextCollections
        );
        if (
            !coderrCollection.properties['AppAssemblyVersion'] &&
            process.env['npm_package_version']
        ) {
            coderrCollection.properties['AppAssemblyVersion'] = process.env['npm_package_version'];
        }
    }

    /**
     * Attach log entries to this property.
     */
    logEntries: coderr.contextCollections.ILogEntry[] = [];

    /**
     * @returns NodeJsContext.NAME ("nodejs")
     */
    contextType: string = NodeJsContext.NAME;

    /**
     * Collections that should be attached to the generated report.
     */
    contextCollections: coderr.contextCollections.IContextCollection[] = [];

    /**
     * HTTP request that failed.
     */
    request?: Request;

    /**
     * Response as is.
     */
    response?: Response;
}
