import '../../../css/activity/staticPage/bigSecret.less'
import axios from 'axios'
import common from 'common'

var isAttent = false
var attentionUid = 8784607

axios.get('/BeautyBoy/InitAttent', {
    params: {
        attentionUid: attentionUid
    }
})
    .then(function (res) {
        if (res.data.data.attent) {
            isAttent = true
            document.querySelector('.add-btn').innerHTML = '已关注'
            document.querySelector('.add-btn').style.backgroundColor = '#c1c1c1'
        }
    })
    .catch(function (err) {
        console.log(err)
    })

// 关注主播
document.querySelector('.add-btn').addEventListener('click', function () {
    if (isAttent) return
    addAttent()
})

function addAttent () {
    axios.get('/BeautyBoy/AddAttent', {
        params: {
            attentionUid: attentionUid
        }
    })
        .then(function (res) {
            if (res.data.data.uid == '0000') return common.goLogin()
            if (res.data.data.result) {
                isAttent = true
                document.querySelector('.add-btn').innerHTML = '已关注'
                document.querySelector('.add-btn').style.backgroundColor = '#c1c1c1'
            }
        })
        .catch(function (err) {
            console.log(err)
        })
}
