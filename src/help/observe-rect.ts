const props = ['width', 'height', 'top', 'right', 'bottom', 'left']

const rectChanged = (a = {}, b = {}) => props.some(prop => a[prop] !== b[prop])

const observedNodes = new Map()
let rafId: any

const run = () => {
	observedNodes.forEach(state => {
	if (state.hasRectChanged) {
			state.callbacks.forEach((cb: (rect: {}) => any) => cb(state.rect))
			state.hasRectChanged = false
		}
	})

	setTimeout(() => {
		observedNodes.forEach((state, node) => {
			const newRect = node.getBoundingClientRect()
			if (rectChanged(newRect, state.rect)) {
				state.hasRectChanged = true
				state.rect = newRect
			}
		})
	}, 0)

	rafId = requestAnimationFrame(run)
}

export default (node: HTMLElement, cb: (rect: {}) => any): { observe: () => void, unobserve: () => void } => {
	if(!node) return 
	return {
		observe() {
			const wasEmpty = observedNodes.size === 0
			if (observedNodes.has(node)) {
				observedNodes.get(node).callbacks.push(cb)
			} else {
				observedNodes.set(node, {
					rect: undefined,
					hasRectChanged: false,
					callbacks: [cb]
				})
			}
			if (wasEmpty) {
				run()
			}
		},

		unobserve() {
			const state = observedNodes.get(node)
			if (state) {
				// Remove the callback
				const index = state.callbacks.indexOf(cb)
				if (index >= 0) {
					state.callbacks.splice(index, 1)
				}

				// Remove the node reference
				if (!state.callbacks.length) {
					observedNodes.delete(node)
				}

				// Stop the loop
				if (!observedNodes.size) {
					cancelAnimationFrame(rafId)
				}
			}
		}
	}
}