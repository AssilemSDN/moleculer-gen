/*
  PATH /src/utils/exit-codes.js
*/
export const ExitCodes = {
  SUCCESS: { code: 0, label: 'SUCCESS', desc: 'Everything went fine' },
  APPLICATION_ERROR: { code: 1, label: 'APPLICATION_ERROR', desc: 'Expected or handled application error' },
  INTERNAL_ERROR: { code: 2, label: 'INTERNAL_ERROR', desc: 'Unexpected internal error' }
}
