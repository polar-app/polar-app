Containers hold components and may be created and destroyed on the fly.

PDF.js has fake 'pages' that come and go and are rendered when needed to save
memory. Otherwise 500 page PDFs wouldn't work.

We have to detect this and only render components and operate when that page
is alive.




