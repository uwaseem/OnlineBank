import Axios from 'axios'

export default function () {
  const url = 'http://handy.travel/test/success.json'

  function getApproval () {
    return Axios({
      url,
      timeout: 2000
    })
      .then(({ data }) => {
        return data.status === 'success'
      })
      .catch(error => {
        console.error('Error while attempting to get transfer approval', error.message)
      })
  }

  async function isTransferApproved () {
    return getApproval()
  }

  return { isTransferApproved }
}
