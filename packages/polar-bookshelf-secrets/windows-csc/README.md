export CSC_LINK=/home/burton/projects/polar-bookshelf-secrets/windows-csc/00C8406FA14CAD991724834F1B0D25C4D3.crt


https://stackoverflow.com/questions/51913963/codesigning-a-windows-build-with-electron-builder-on-a-mac-not-working

To get a Windows signing certificate, we recommend Digicert. The documentation
for Windows app signing is surprisingly bad. If you go with the wrong vendor,
they'll ask you to mail them notarized paperwork. That makes it a slow and
annoying process to get the cert. Digicert is easier: they just send you a
password via Certified Mail, you go to the post office, show your ID to pick it
up, and bam, you get your signing certificate.


https://www.comodo.com/login/comodo-members.php?af=7639


This was a REAL pain to get installed.

First. I had to buy the cert from Comodo.

Then I had to  use manta.com to register spinn3r so they could call and do the 
phone validation.

Maybe Godaddy would be easier next time.

Then the key is saved in Firefox... so I nad to login, go to My Certificates, 
then export the key back out to a p12 file.  it adds the password there and 
I have to set the CSC_LINK and the password as env vars to electron-builder. 
