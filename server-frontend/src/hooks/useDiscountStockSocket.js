import { useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

const useDiscountStockSocket = (productId, enabled = true) => {
  const [remainingStock, setRemainingStock] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!enabled || !productId) {
      setRemainingStock(null)
      setConnected(false)
      return undefined
    }

    const client = new Client({
      webSocketFactory: () => new SockJS('/ws'),
      reconnectDelay: 5000,
      debug: () => {},
    })

    client.onConnect = () => {
      setConnected(true)

      client.subscribe(`/topic/products/${productId}/discount-stock`, (message) => {
        try {
          const payload = JSON.parse(message.body)

          if (Number(payload.productId) === Number(productId)) {
            setRemainingStock(Number(payload.remainingStock || 0))
          }
        } catch (error) {
          console.error('Failed to parse discount stock message:', error)
        }
      })
    }

    client.onDisconnect = () => {
      setConnected(false)
    }

    client.onStompError = (frame) => {
      console.error('Discount stock websocket error:', frame.headers?.message, frame.body)
    }

    client.activate()

    return () => {
      setConnected(false)
      client.deactivate()
    }
  }, [enabled, productId])

  return { remainingStock, connected }
}

export default useDiscountStockSocket
