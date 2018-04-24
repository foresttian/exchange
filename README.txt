This is a simple program transform one kind of currency with specific amount to another kind of currency.

Before all:
Ensure install newest node.js.

How to run:
1.unzip myapp
2.open windows console
3.change dir to mypp
4.run command node
5.run command as var exc = require('./index.js')
6.run command exc.exchangeCurrency(date, base, amount, conversion)
	date: format should be "YYYY-MM-DD", base: base currency like "USD",
	amount: currency amount like 100, conversion: conversion currency like "USD","CAD"
7.try exc.exchangeCurrency('2011-02-03', 'USD', 100, 'CAD')


