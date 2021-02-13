
## just used so that we know we've sourced the credentials file...
export HAS_CREDENTIALS=true

export GH_TOKEN=26722e632127b9548ce62024686d64c38e2b1994
export CSC_IDENTITY_AUTO_DISCOVERY=true

export APPLEID=burtonator2011@gmail.com
# export APPLEIDPASS=nlrs-matd-xulq-hvur
# export APPLEIDPASS=fzuy-vfgn-syyj-dvlb
# export APPLEIDPASS=cfop-pksv-kbwa-wumi

# I don't think app specific passwords last very long and that we have to create
# a new one with each release...?
# https://appleid.apple.com/account/manage
export APPLEIDPASS=pfux-lhbg-lnib-zhgu


if [ "${TERM_PROGRAM}" = "Apple_Terminal" ] && [ "${APPLEIDPASS}" = "" ]; then
  echo "ERROR: Must set APPLEIDPASS. Hint: pass is F*******3"
fi
