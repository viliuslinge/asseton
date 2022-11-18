/**
 * Api:
 *
 * /data GET
 * 1. Fails getting data of not existing provider
 * 2. Fails getting data of existing provider if authentication doesnt exist
 * 3. Succeeds getting data of existing provider if authentication exists
 * 4. Succeeds getting cached data of existing provider if authentication exists
 * 5. Succeeds getting refreshed data of existing provider if authentication exists
 *
 * /authentication POST
 * 1. Fails authentication of not existing provider
 * 2. Fails authentication if completed and valid authentication exists
 * 3. Succeeds initiating authenticating for the first time
 * 4. Succedds initiating authentication if incompleted authentication exists. Returns existing authentication
 *
 * /authentication DELETE
 * 1. Fails deleting authentication of not existing provider
 * 2. Fails deleting authentication of authentication doesnt exist
 * 3. Succeeds deleting authentication if authentication exists
 */
