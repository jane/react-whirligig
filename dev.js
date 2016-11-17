import { render } from 'react-dom'
import Track from './src/track/index'
import { mySlide, track } from './dev-style.css'

render((
  <Track visibleSlides={3} className={track}>{
    () => {
      return [
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/400/300" />
          <figcaption>Fill Murray</figcaption>
        </figure>,
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/400/400" />
          <figcaption>Fill Murray</figcaption>
        </figure>,
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/300/400" />
          <figcaption>Fill Murray</figcaption>
        </figure>,
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/400/200" />
          <figcaption>Fill Murray</figcaption>
        </figure>,
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/200/400" />
          <figcaption>Fill Murray</figcaption>
        </figure>,
        <figure className={mySlide}>
          <img src="http://www.fillmurray.com/400/400" />
          <figcaption>Fill Murray</figcaption>
        </figure>
      ]
    }
  }</Track>
), document.querySelector('main'))
