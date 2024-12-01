import gsap from 'gsap';
import { useEffect, useRef } from 'react';
import '../css/overlay.css';
import Logo from "../svg/Logo";
import { useProgress } from '@react-three/drei';
import { usePlay } from './Play';
import DTLogo from '../svg/DTLogo';

const myWebsite = process.env.REACT_APP_MY_SITE;

const Overlay = () => {
  const { play, end, setPlay, hasScroll } = usePlay(); // play,end state for start
  
  const buttonRef = useRef(null); // Ref for the button

  const { progress } = useProgress(); // Progress for loader animation

  useEffect(() => {
    // Only initialize GSAP when the button is available
    if (progress === 100 && buttonRef.current) {
      const buttonElement = buttonRef.current;
      const flairElement = buttonElement.querySelector('.button__flair');

      const xSet = gsap.quickSetter(flairElement, "xPercent");
      const ySet = gsap.quickSetter(flairElement, "yPercent");

      const getXY = (e) => {
        const { left, top, width, height } = buttonElement.getBoundingClientRect();

        const xTransformer = gsap.utils.pipe(
          gsap.utils.mapRange(0, width, 0, 100),
          gsap.utils.clamp(0, 100)
        );

        const yTransformer = gsap.utils.pipe(
          gsap.utils.mapRange(0, height, 0, 100),
          gsap.utils.clamp(0, 100)
        );

        return {
          x: xTransformer(e.clientX - left),
          y: yTransformer(e.clientY - top),
        };
      };

      const handleMouseEnter = (e) => {
        const { x, y } = getXY(e);
        xSet(x);
        ySet(y);

        gsap.to(flairElement, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        });
      };

      const handleMouseLeave = (e) => {
        const { x, y } = getXY(e);

        gsap.killTweensOf(flairElement);

        gsap.to(flairElement, {
          xPercent: x > 90 ? x + 20 : x < 10 ? x - 20 : x,
          yPercent: y > 90 ? y + 20 : y < 10 ? y - 20 : y,
          scale: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      };

      const handleMouseMove = (e) => {
        const { x, y } = getXY(e);

        gsap.to(flairElement, {
          xPercent: x,
          yPercent: y,
          duration: 0.4,
          ease: "power2",
        });
      };

      buttonElement.addEventListener('mouseenter', handleMouseEnter);
      buttonElement.addEventListener('mouseleave', handleMouseLeave);
      buttonElement.addEventListener('mousemove', handleMouseMove);

      return () => {
        buttonElement.removeEventListener('mouseenter', handleMouseEnter);
        buttonElement.removeEventListener('mouseleave', handleMouseLeave);
        buttonElement.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [progress]); // Depend on `progress` to re-run when it's 100

  return (
    <div className={`overlayBox ${play ? "overlayBox--disappear" : ""} ${hasScroll ? "overlay--scrolled" : ""}`}>
      <div className={`loader ${progress === 100 ? "loader--disappear" : ""}`} />
      {progress === 100 && (
        <div className={`introBox ${play ? "intro-disappear" : ""}`} >
          <h1 id="topText">
            <Logo />
          </h1>
          <p className='intro__scroll'>Scroll down</p>
          <a
            href="#"
            className="button button--stroke"
            data-block="button"
            ref={buttonRef}
            onClick={() => {setPlay(true);}}
          >
            <span className="button__flair"></span>
            <span className="button__label">Check out</span>
          </a>
        </div>
      )}
      <div className={`outro ${end ? "outro--appear" : ""}`}>
        <p className='outro__text'>Thank you for browsing through the website</p>
        <div>My socials</div>
        {end ? (
            <button>
                <DTLogo />
            </button>
        ): null}
      </div>
    </div>
  );
};

export default Overlay;
