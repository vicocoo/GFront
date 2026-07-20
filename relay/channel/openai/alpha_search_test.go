package openai

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

func TestAdaptorAlphaSearchUsesOpenAIURLAndAuthorization(t *testing.T) {
	gin.SetMode(gin.TestMode)
	ctx, _ := gin.CreateTestContext(httptest.NewRecorder())
	ctx.Request = httptest.NewRequest(http.MethodPost, "/v1/alpha/search", nil)

	info := &relaycommon.RelayInfo{
		RelayMode: relayconstant.RelayModeCodexSearch,
		ChannelMeta: &relaycommon.ChannelMeta{
			ChannelType:    constant.ChannelTypeOpenAI,
			ChannelBaseUrl: "https://api.example.com",
			ApiKey:         "sk-test",
		},
		RequestURLPath: "/v1/alpha/search",
	}

	adaptor := &Adaptor{}
	requestURL, err := adaptor.GetRequestURL(info)
	require.NoError(t, err)
	assert.Equal(t, "https://api.example.com/v1/alpha/search", requestURL)

	header := http.Header{}
	require.NoError(t, adaptor.SetupRequestHeader(ctx, &header, info))
	assert.Equal(t, "Bearer sk-test", header.Get("Authorization"))
	assert.Empty(t, header.Get("chatgpt-account-id"))
}
