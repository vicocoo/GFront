package model

import (
	"testing"

	"github.com/QuantumNous/new-api/constant"
	"github.com/stretchr/testify/assert"
)

func TestChannelSupportsAlphaSearchForOpenAIAndCodex(t *testing.T) {
	tests := []struct {
		name        string
		channelType int
		supported   bool
	}{
		{name: "OpenAI", channelType: constant.ChannelTypeOpenAI, supported: true},
		{name: "Codex subscription", channelType: constant.ChannelTypeCodex, supported: true},
		{name: "OpenRouter", channelType: constant.ChannelTypeOpenRouter, supported: false},
		{name: "Azure", channelType: constant.ChannelTypeAzure, supported: false},
		{name: "Advanced Custom", channelType: constant.ChannelTypeAdvancedCustom, supported: false},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			channel := &Channel{Type: tt.channelType}
			assert.Equal(t, tt.supported, ChannelSupportsRequestPath(channel, constant.CodexSearchPath, "gpt-5.6"))
		})
	}
}

func TestChannelSupportsRequestPathRejectsNilChannel(t *testing.T) {
	assert.False(t, ChannelSupportsRequestPath(nil, constant.CodexSearchPath, "gpt-5.6"))
}
