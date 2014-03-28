# calculator.coffee
calculator = require 'calculator'

describe 'Calculator', ->

  it 'can add two numbers', ->
    result = calculator.add 2, 3
    expect(result).toBe 5