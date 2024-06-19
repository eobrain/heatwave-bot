import { toot } from './mastodon.js'
import { optimize, currentPlace, relTime, BODY_TEMP, humanEffect } from 'wetbulb'
import { geocode } from './geocode.js'

const api = (lat, lon) => `https://weather-424404.uc.r.appspot.com/?lat=${lat}&lon=${lon}`

async function heatwaveBot (bounds, unit, convert) {
  let count = 0
  const { worstPlace, worstResult } = await optimize(api,
    data => {
      console.log(++count, currentPlace())
    },
    bounds)

  console.log(worstPlace, worstResult)

  const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase()
  const country = worstResult.country.split(/[\s-]+/).map(capitalize).join('')
  const when = relTime(worstResult.date)
  const wetbulb = Math.round(convert(worstResult.wetbulb))
  const sweatability = Math.round(convert(BODY_TEMP) - convert(worstResult.wetbulb))
  const effect = humanEffect(worstResult.wetbulb)
  const humidity = Math.round(worstResult.humidity)
  const temp = Math.round(convert(worstResult.temp))
  const feelsLike = Math.round(convert(worstResult.feelsLike))
  const { lat, lon } = worstPlace
  const mapUrl = `https://maps.google.com/?ll=${lat},${lon}&q=${lat},${lon}&z=5`
  const placeName = await geocode(lat, lon)

  // const searchUrl = `https://www.google.com/search?q=%22${encodeURIComponent(worstResult.name)}%22+${encodeURIComponent(worstResult.country)}+excessive+heat`

  toot(`
${when} in ${worstResult.name}, #${country} (${placeName}) there will be a #Heatwave with a wet-bulb temperature of

      ${wetbulb}°${unit}

This will be a margin of ${sweatability} degrees below body temperature which will ${effect}

The actual temperature will be ${temp}°${unit}

It will feel like ${feelsLike}°${unit}

The humidity will be ${humidity}%

There will be ${worstResult.weather}

#Heatwave${country}

${mapUrl}
`)
}

const farenheit = (celsius) => celsius * 9 / 5 + 32
const celsius = (celsius) => celsius

if (process.argv.length <= 3) {
  console.log('Missing arguments:   world|USA   C|F', process.argv)
} else {
  try {
    const region = process.argv[2]
    const unit = process.argv[3]
    let convert
    let bounds

    switch (unit) {
      case 'C':
        convert = celsius
        break
      case 'F':
        convert = farenheit
        break
      default:
        throw new Error('Invalid unit')
    }

    switch (region) {
      case 'world':
        bounds = {
          maxLat: 90,
          minLat: -90,
          maxLon: 180,
          minLon: -180
        }
        break
      case 'USA':
        bounds = {
          maxLat: 49.382808,
          minLat: 24.521208,
          maxLon: -66.945392,
          minLon: -124.736342
        }
        break
      default:
        throw new Error('Invalid region')
    }

    await heatwaveBot(bounds, unit, convert)
  } catch (e) {
    console.log('Exception: ', e)
  }
}
