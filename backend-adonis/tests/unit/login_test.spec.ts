import { test } from '@japa/runner'
import User from '#models/user'
import { loginValidator } from '#validators/auth'

test.group('Auth login validation', () => {
  test('verify credentials work for seeded users with dots in email', async ({ assert }) => {
    const validatedSub = await loginValidator.validate({
      email: 'salazar.mares.enrique.oliband@gmail.com',
      password: 'password',
    })
    assert.equal(validatedSub.email, 'salazar.mares.enrique.oliband@gmail.com')

    const userSub = await User.verifyCredentials(validatedSub.email, validatedSub.password)
    assert.equal(userSub.email, 'salazar.mares.enrique.oliband@gmail.com')

    const validatedCreador = await loginValidator.validate({
      email: 'liosauriopro11@gmail.com',
      password: 'password',
    })
    assert.equal(validatedCreador.email, 'liosauriopro11@gmail.com')

    const userCreador = await User.verifyCredentials(validatedCreador.email, validatedCreador.password)
    assert.equal(userCreador.email, 'liosauriopro11@gmail.com')
  })
})
