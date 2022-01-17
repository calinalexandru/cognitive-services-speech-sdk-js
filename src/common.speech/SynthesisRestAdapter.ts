import {
    IRequestOptions,
    IRestResponse,
    RestConfigBase,
    RestMessageAdapter,
    RestRequestType,
} from "../common.browser/Exports";
import {
    PropertyId,
} from "../sdk/Exports";
import { ConnectionFactoryBase } from "./ConnectionFactoryBase";
import { SynthesizerConfig } from "./Exports";
import { HeaderNames } from "./HeaderNames";

/**
 * Implements methods for speaker recognition classes, sending requests to endpoint
 * and parsing response into expected format
 * @class SynthesisRestAdapter
 */
export class SynthesisRestAdapter {
    private privRestAdapter: RestMessageAdapter;
    private privUri: string;

    public constructor(config: SynthesizerConfig) {

        let endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Endpoint, undefined);
        if (!endpoint) {
            const region: string = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Region, "westus");
            const hostSuffix: string = ConnectionFactoryBase.getHostSuffix(region);
            endpoint = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Host, `https://${region}.tts.speech${hostSuffix}`);
        }
        this.privUri = `${endpoint}/cognitiveservices/voices/list`;

        const options: IRequestOptions = RestConfigBase.requestOptions;
        options.headers[RestConfigBase.configParams.subscriptionKey] = config.parameters.getProperty(PropertyId.SpeechServiceConnection_Key, undefined);

        this.privRestAdapter = new RestMessageAdapter(options);
    }

    /**
     * Sends list voices request to endpoint.
     * @function
     * @public
     * @param connectionId - guid for connectionId
     * @returns {Promise<IRestResponse>} rest response to status request
     */
    public getVoicesList(connectionId: string): Promise<IRestResponse> {
        this.privRestAdapter.setHeaders(HeaderNames.ConnectionId, connectionId);
        return this.privRestAdapter.request(RestRequestType.Get, this.privUri);
    }

}