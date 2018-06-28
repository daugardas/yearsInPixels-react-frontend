import React, { Component } from 'react';
import injectSheet from 'react-jss';

const styles = {
  container: {
    display: 'flex',
    width: 600,
    alignItems: `center`,
    justifyContent: `center`,
    flexDirection: `column`,
    margin: {
      top: 0,
      right: `auto`,
      bottom: 0,
      left: `auto`
    },
    padding: 30
  },
  header: {
    fontSize: 50,
    color: `#4b5b66`
  },
  paragraph: {
    fontSize: 20,
    color: `#4b5b66`,
    lineHeight: `35px`,
    fontFamily: `Indie Flower, cursive !important`,
    '& a': {
      fontFamily: `Indie Flower, cursive !important`
    }
  }
}

class About extends Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <h1 className={classes.header}>A Year In Pixels</h1>
        <p className={classes.paragraph}>
          The Year in Pixels chart was created by Camille or <span> </span>
          <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/passioncarnets/">@passioncarnets</a> on Instagram,
           and she has written a bit about how it came to be here. While the scale of this mood tracker is large,
           the concept is deceptively simple.
           I already set up your own chart, with twelve columns for each months of your selected year.
           That means that there are exactly 365 squares, or pixels, for you to track your mood for a year!
           <br />
          You also get your own personal key, I included a default one, which you can edit however you want to!
        </p>
        <h1 className={classes.header}>The ultimate mood tracker</h1>
        <p className={classes.paragraph}>
          You might be wondering why you would want to keep a mood tracker like A Year in Pixels.
          Well, there are a few reasons that you might benefit:
          <br />
          For people with anxiety, depression, or other mental health issues,
          it can be an excellent way to track symptoms and episodes over a long period of time – either for themselves or to share with their doctors.
          You can be caught up in a bad mood or bad mental health day and think that your whole life is bad.
          But if you keep a Year in Pixels page,
          you can look at your patterns and see that maybe it isn’t as bad as it seems.
          <br />
          Keeping a mood tracker is also a great way to see if your moods have a certain pattern.
          Knowing when your mood patterns come and go means you can plan and prepare ahead of time.
          If you know you get stressed out during a certain day of the week,
          time of the month, or time of the year,
          you can take extra care of yourself during those down times.
          Or you can plan a day trip to lift your spirits, get away, or grab some precious alone time.
        </p>
        <h1 className={classes.header}>How this web app idea came to be</h1>
        <p className={classes.paragraph}>
          One day, while browsing <a target="_blank" rel="noopener noreferrer" href="https://www.reddit.com/">Reddit</a>,
          I came across a post which mentioned Year In Pixels graph.
          I thought that trying this might be a good idea, but knowing me,
          I don't like to write things down in a notebook or something like that,
          I always enjoy an app or a website a lot more.
          After searching a little bit, I couldn't find a Year In Pixels web app.
          So I decided to create one, for myself,
          and for other people who might want to use a web version too. And here we are today.
        </p>
      </div>
    );
  }
  componentDidMount() {
    this.props.resizeBackground();
  }
}

export default injectSheet(styles)(About)