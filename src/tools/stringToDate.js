import {
    analysisDate,
    transformCommon,
} from './_common'

export default (dateString='') => {
    dateString = analysisDate(dateString)
    try {
        dateString = new Date(transformCommon(dateString))
        return dateString.getTime() / 1000
    } catch (e) {
        return ""
    }
}