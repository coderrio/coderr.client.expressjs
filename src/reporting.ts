import { IPipeline } from 'coderr.client';

export var pipeline: IPipeline;

export function assignPipeline(p: IPipeline) {
    pipeline = p;
}
