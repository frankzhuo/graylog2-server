/**
 * This file is part of Graylog.
 *
 * Graylog is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Graylog is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Graylog.  If not, see <http://www.gnu.org/licenses/>.
 */
package org.graylog.plugins.pipelineprocessor.functions.strings;

import org.apache.commons.lang3.StringUtils;

import java.util.Locale;

public class Uppercase extends StringUtilsFunction {

    public static final String NAME = "uppercase";

    @Override
    protected String getName() {
        return NAME;
    }

    @Override
    protected String description() {
        return "Uppercases a string";
    }

    @Override
    protected boolean isLocaleAware() {
        return true;
    }

    @Override
    protected String apply(String value, Locale locale) {
        return StringUtils.upperCase(value, locale);
    }
}
