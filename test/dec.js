class Boy {
  @speak('hello')
  run () {
    console.log('I can speak!' + this.lang)
    console.log('I can run!')
  }
}

function speak (lang) {
  return (target, key, descriptor) => {
    console.log(target)
    console.log(key)
    console.log(descriptor)
    target.lang = lang

    return descriptor
  }
}


const bob = new Boy()

bob.run()