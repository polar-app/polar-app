https://gist.github.com/Parakoos/30b7fcf13cfcd3920b89d6a7c28ebdec

# archive.ts

```typescript

import { Readable, Writable, WritableOptions } from 'stream'
import archiver = require('archiver')

export type ZipStreamChunk = {
	source: string | Readable | Buffer
	data?: archiver.EntryData | archiver.ZipEntryData | undefined
}

/** Creates an archive stream that can be used to zip up and write data to the given out stream.
 * @param output The output stream to write zipped data to.
 * @returns a writable object stream. The objects should be of type ZipStreamChunk
 */
export class ArchiveWritable extends Writable {
	archive = archiver('zip', { zlib: { level: 9 } })
	output: NodeJS.WritableStream
	count = 0
	lastLogTime = Date.now()
	constructor(output: NodeJS.WritableStream, options: Omit<WritableOptions, 'objectMode'> = {}) {
		super({ ...options, objectMode: true })
		this.archive.pipe(output)
		this.output = output
	}

	_write(
		chunk: ZipStreamChunk,
		_encoding: BufferEncoding,
		callback: (error?: Error | null) => void
	) {
		if (Date.now() - this.lastLogTime >= 60000) {
			console.log(`Zipped ${this.count} files and counting...`)
			this.lastLogTime = Date.now()
		}
		this.count++
		const entryCB = () => {
			cleanup()
			callback()
		}
		const errorCB = (error: Error) => {
			cleanup()
			callback(error)
		}
		const cleanup = () => {
			this.archive.removeListener('entry', entryCB)
			this.archive.removeListener('error', errorCB)
		}
		this.archive.once('entry', entryCB)
		this.archive.once('error', errorCB)
		this.archive.append(chunk.source, chunk.data)
	}
	_final(callback: (error?: Error | null) => void) {
		console.log(`Done zipping all ${this.count} files.`)
		const finishCB = () => {
			cleanup()
			callback()
		}
		const errorCB = (error: Error) => {
			cleanup()
			callback(error)
		}
		const cleanup = () => {
			this.archive.removeListener('finish', finishCB)
			this.archive.removeListener('error', errorCB)
		}
		this.output.once('finish', finishCB)
		this.output.once('error', errorCB)
		this.archive.finalize()
	}
}

```

# export.ts

```typescript

import stream from 'stream'
import { promisify } from 'util'
import { storage } from '../firebase-admin'
import { ArchiveWritable } from '../utils/archive'
import { DateString } from '../../../utils/dateUtils'
import { YourTransformer } from './transform'

export async function streamAllPhotosAndUserDataToZipArchive(
	userDoc: FirebaseFirestore.DocumentSnapshot,
	startDate: DateString,
	endDate: DateString
) {
	const fileName = `${startDate} to ${endDate}.zip`
	const exportFile = storage().file(`Users/${userDoc.id}/Exports/${fileName}`)
	const photoSnapStream = userDoc.ref
		.collection('Photos')
		.orderBy('date', 'asc')
		.where('date', '>=', startDate)
		.where('date', '<=', endDate)
		.stream()
	await promisify(stream.pipeline)(
		photoSnapStream,
		new YourTransformer({ highWaterMark: 1 }),
		new ArchiveWritable(exportFile.createWriteStream(), { highWaterMark: 1 })
	)
	await exportFile.setMetadata({ contentDisposition: `attachment; filename="${fileName}"` })
	return exportFile
}

```

# transform.ts

```typescript

import { Transform, TransformOptions } from 'stream'
import { ZipStreamChunk } from '../utils/archive'

export class YourTransformer extends Transform {
	// This data array is here for the special case I had where I needed to remember some data
	// from all the picture files going through the transformer, and then once all the photos
	// were done, stringify all the collected data and send it down the pipe as one
	// last data.json file to be zipped. If you don't need this, delete as you see fit.
	dataArray: any[]
	constructor(options: Omit<TransformOptions, 'objectMode'> = {}) {
		super({ ...options, objectMode: true })
		this.dataArray = []
	}
	// Store the photo DB data in an array for later, and then create the zip stream chunk for the file and pass it on down the line
	_transform(snapshot: any, _encoding: any, callback: Function) {
		// Oh, the snapshot type of any is wrong. It should be snapshot or something...
		// I have edited this code a bit, and lost the typing along the way. You can figure it out... :-)

		const zipEntry: ZipStreamChunk = ... // left for you to implement...
		// // Basically, you need to convert the incoming snapshots to the interface of the
		// //  ZipStreamChunk. See arhive.ts.
		// // Also populate dataArray if you need it.
		callback(null, zipEntry)
	}
	// Only zip stream chunk left to pass on down the line is the data.json file itself.
	// Again, only if you need this, otherwise skip.
	_flush(callback: Function) {
		callback(null, {
			source: JSON.stringify(this.dataArray),
			data: { name: 'data.json' },
		} as ZipStreamChunk)
	}
}
```
