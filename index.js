import { toot } from './mastodon.js'
import { optimize, currentPlace, relTime, BODY_TEMP, humanEffect } from 'wetbulb'
import { geocode } from './geocode.js'

const api = (lat, lon) => `https://weather-424404.uc.r.appspot.com/?lat=${lat}&lon=${lon}`

let count = 0
const { worstPlace, worstResult } = await optimize(api,
  data => {
    console.log(++count, currentPlace())
  })

console.log(worstPlace, worstResult)

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase()
const country = worstResult.country.split(/[\s-]+/).map(capitalize).join('')
const when = relTime(worstResult.date)
const wetbulb = Math.round(worstResult.wetbulb)
const sweatability = Math.round(BODY_TEMP - worstResult.wetbulb)
const effect = humanEffect(worstResult.wetbulb)
const humidity = Math.round(worstResult.humidity)
const temp = Math.round(worstResult.temp)
const feelsLike = Math.round(worstResult.feelsLike)
const { lat, lon } = worstPlace
const mapUrl = `https://maps.google.com/?ll=${lat},${lon}&q=${lat},${lon}&z=5`
const placeName = await geocode(lat, lon)

// const searchUrl = `https://www.google.com/search?q=%22${encodeURIComponent(worstResult.name)}%22+${encodeURIComponent(worstResult.country)}+excessive+heat`

toot(`
${when} in ${worstResult.name}, #${country} (${placeName}) there will be a #Heatwave with a wet-bulb temperature of

      ${wetbulb}°C

This will be a margin of ${sweatability} degrees below body temperature which will ${effect}

The actual temperature will be ${temp}°C

It will feel like ${feelsLike}°C

The humidity will be ${humidity}%

There will will be ${worstResult.weather}

#Heatwave${country}

${mapUrl}
`)
