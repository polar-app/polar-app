
export GH_TOKEN=26722e632127b9548ce62024686d64c38e2b1994
export CSC_IDENTITY_AUTO_DISCOVERY=true

export APPLEID=burtonator2011@gmail.com
export APPLEIDPASS=nlrs-matd-xulq-hvur

if [ "${TERM_PROGRAM}" = "Apple_Terminal" ] && [ "${APPLEIDPASS}" = "" ]; then
  echo "ERROR: Must set APPLEIDPASS. Hint: pass is F*******3"
fi
