/*
  PATH  /src/core/utils/exit-codes.js
*/
export const ExitCodes = {
  SUCCESS: { code: 0, label: 'SUCCESS', desc: 'Everything went fine' },
  USER_ERROR: { code: 1, label: 'USER_ERROR', desc: 'Invalid input or user mistake' },
  INTERNAL_ERROR: { code: 2, label: 'INTERNAL_ERROR', desc: 'Unexpected internal error' }
}
