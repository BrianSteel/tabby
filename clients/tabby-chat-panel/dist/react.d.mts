import { RefObject } from 'react';
import { Api } from './index.mjs';
import '@quilted/threads';

declare function useClient(iframeRef: RefObject<HTMLIFrameElement>): Api | undefined;
declare function useServer(api: Api): Record<string, any> | undefined;

export { useClient, useServer };
