package codex

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/QuantumNous/new-api/constant"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	relayconstant "github.com/QuantumNous/new-api/relay/constant"
	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestAdaptorAlphaSearchUsesCodexURLAndSubscriptionAuthorization(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctx, _ := gin.CreateTestContext(httptest.NewRecorder())
	ctx.Request = httptest.NewRequest(http.MethodPost, "/v1/alpha/search", nil)

	info := &relaycommon.RelayInfo{
		RelayMode: relayconstant.RelayModeCodexSearch,
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelType:    constant.ChannelTypeCodex,
			ChannelBaseUrl: "https://chatgpt.example.com",
			ApiKey:         `{"access_token":"oauth-token","account_id":"acct-123"}`,
		},
	}

	adaptor := &Adaptor{}
	requestURL, err := adaptor.GetRequestURL(info)
	require.NoError(t, err)
	assert.Equal(t, "https://chatgpt.example.com/backend-api/codex/alpha/search", requestURL)

	header := http.Header{}
	require.NoError(t, adaptor.SetupRequestHeader(ctx, &header, info))
	assert.Equal(t, "Bearer oauth-token", header.Get("Authorization"))
	assert.Equal(t, "acct-123", header.Get("chatgpt-account-id"))
	assert.Equal(t, "responses=experimental", header.Get("OpenAI-Beta"))
	assert.Equal(t, "codex_cli_rs", header.Get("originator"))
	assert.Equal(t, "application/json", header.Get("Content-Type"))
}
