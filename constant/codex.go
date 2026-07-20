package constant

const CodexSearchPath = "/v1/alpha/search"

const ContextKeyCodexSearchBillingFallback ContextKey = "codex_search_billing_fallback"

// IsAlphaSearchChannelType reports whether a channel can serve /v1/alpha/search.
// Use the concrete channel type so other OpenAI-compatible adaptors do not opt in.
func IsAlphaSearchChannelType(channelType int) bool {
	return channelType == ChannelTypeOpenAI || channelType == ChannelTypeCodex
}
