
/**
 *
 */
export default class Model {

	public readonly docMeta: any;

	/**
	 *
	 * @param persistenceLayer
	 */
	new (persistenceLayer : any): Model;

	/**
	 * Called when a new document has been loaded.
	 * @param fingerprint
	 * @param nrPages
	 * @param currentPageNumber
	 * @return
	 */
	documentLoaded(fingerprint : string, nrPages : number, currentPageNumber : number): /* !this.docMeta */ any;

	/**
	 *
	 * @param eventListener
	 */
	registerListenerForDocumentLoaded(eventListener : any): void;

	/**
	 * @refactor This code should be in its own dedicated helper class
	 * @param pageNum
	 * @param pageNum
	 */
	erasePagemark(pageNum : any): void;

	/**
	 *
	 * @param pageNum
	 */
	assertPageNum(pageNum : any): void;

	/**
	 * @deprecated
	 * @param eventListener
	 * @param eventListener
	 */
	registerListenerForCreatePagemark(eventListener : any): void;

	/**
	 * @deprecated
	 * @param eventListener
	 * @param eventListener
	 */
	registerListenerForErasePagemark(eventListener : any): void;

}
